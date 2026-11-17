/*
 * StyleFlip - Saved Designs storage client.
 *
 * Saved designs are stored by the StyleFlip backend in AWS S3 (one folder per
 * design) with a metadata record per design. This file is the ONLY place that
 * knows the API base URL and the user id used for saving / loading designs.
 *
 *   USER ID: static for now (70011). When login is added, call
 *   SFSavedDesigns.setUserId(<logged-in user id>) - the Saved Designs list
 *   reloads for that user automatically. Nothing else needs to change.
 *
 * Browser localStorage (key = designer container id, 'clothing-designer') is
 * only a small cache of the list (title, id, thumbnail URL) so other existing
 * code that reads it keeps working. It is never the permanent copy.
 *
 * Loaded before FancyProductDesigner.js (see src/index.html).
 */
(function () {
  'use strict';

  var CONFIG = (window.SF_SAVED_DESIGNS_CONFIG = Object.assign(
    {
      apiBase: 'https://styleflip-backend-jdm5.ithemes.xyz/api',
      // Static user id for now - see header comment.
      userId: '70011',
      cacheKey: 'clothing-designer',
      timeoutMs: 60000
    },
    window.SF_SAVED_DESIGNS_CONFIG || {}
  ));

  var USER_CHANGE_EVENT = 'sf-saved-designs:userchange';

  function designsUrl(designId) {
    return (
      CONFIG.apiBase.replace(/\/+$/, '') +
      '/sharedproduct/user/' +
      encodeURIComponent(String(CONFIG.userId)) +
      (designId ? '/' + encodeURIComponent(designId) : '')
    );
  }

  // fetch + JSON + readable errors (server message or HTTP status).
  function request(method, url, body) {
    var controller = typeof AbortController !== 'undefined' ? new AbortController() : null;
    var timer = controller && setTimeout(function () { controller.abort(); }, CONFIG.timeoutMs);
    var opts = { method: method };
    if (controller) opts.signal = controller.signal;
    if (body !== undefined) {
      opts.headers = { 'Content-Type': 'application/json' };
      opts.body = JSON.stringify(body);
    }
    return fetch(url, opts)
      .then(function (res) {
        return res
          .json()
          .catch(function () { return null; })
          .then(function (data) {
            if (!res.ok || !data || data.success === false) {
              var err = new Error((data && data.message) || 'Request failed (HTTP ' + res.status + ')');
              err.status = res.status;
              throw err;
            }
            return data;
          });
      })
      .catch(function (e) {
        if (e && e.name === 'AbortError') throw new Error('The server did not respond in time.');
        // Errors built above carry an HTTP status; anything else is a network failure.
        if (e && e.status !== undefined) throw e;
        var net = new Error('Could not reach the server. Check your connection and try again.');
        net.cause = e;
        throw net;
      })
      .finally(function () { if (timer) clearTimeout(timer); });
  }

  // A save only counts as done when the server returned the stored design.
  function requireDesign(d) {
    if (!d || !d.design || !d.design.design_id) {
      throw new Error('The server did not confirm the save.');
    }
    return d.design;
  }

  // ---------------- lightweight list cache (localStorage) ----------------
  function readCache() {
    try {
      var v = JSON.parse(window.localStorage.getItem(CONFIG.cacheKey) || '[]');
      return Array.isArray(v) ? v : [];
    } catch (e) {
      return [];
    }
  }
  function writeCache(list) {
    try {
      window.localStorage.setItem(CONFIG.cacheKey, JSON.stringify(list));
      return true;
    } catch (e) {
      return false; // quota / private mode - cache only, never fatal
    }
  }
  // A cache entry for a design stored on the server.
  function toCacheEntry(d) {
    return {
      _sf: 1,
      userId: d.userId,
      design_id: d.design_id,
      title: d.title,
      thumbnail: d.thumbnailUrl,
      thumbnailUrl: d.thumbnailUrl,
      uploadedAt: d.uploadedAt,
      updatedAt: d.updatedAt
    };
  }
  // Old browser-only entries (full product inside localStorage) that have not
  // been uploaded yet. They are kept until the server confirms each upload.
  function isLegacyEntry(e) {
    return !!e && !e._sf && Array.isArray(e.product) && e.product.length > 0;
  }

  window.SFSavedDesigns = {
    config: CONFIG,
    USER_CHANGE_EVENT: USER_CHANGE_EVENT,

    apiBase: function () { return CONFIG.apiBase.replace(/\/+$/, ''); },
    getUserId: function () { return String(CONFIG.userId); },
    /** Switch user (e.g. after login). The Saved Designs list reloads. */
    setUserId: function (id) {
      if (id === undefined || id === null || String(id) === '') return;
      if (String(id) === String(CONFIG.userId)) return;
      CONFIG.userId = String(id);
      window.dispatchEvent(new CustomEvent(USER_CHANGE_EVENT, { detail: { userId: CONFIG.userId } }));
    },

    /** [{design_id, title, thumbnailUrl, uploadedAt, updatedAt, userId}] */
    list: function () {
      return request('GET', designsUrl()).then(function (d) { return d.designs || []; });
    },
    /** Full design incl. product. */
    get: function (designId) {
      return request('GET', designsUrl(designId)).then(function (d) { return d.design; });
    },
    /** {title, thumbnail(dataURL|https), product, design_id?, uploadedAt?} -> summary */
    create: function (payload) {
      return request('POST', designsUrl(), payload).then(requireDesign);
    },
    /** Overwrites the same design (same id). */
    update: function (designId, payload) {
      return request('PUT', designsUrl(designId), payload).then(requireDesign);
    },
    /** Deletes the design's S3 files and record. Rejects if anything failed. */
    remove: function (designId) {
      return request('DELETE', designsUrl(designId));
    },

    readCache: readCache,
    writeCache: writeCache,
    toCacheEntry: toCacheEntry,
    isLegacyEntry: isLegacyEntry,
    legacyEntries: function () { return readCache().filter(isLegacyEntry); },
    /**
     * Replace the cache with the server list, keeping legacy entries that are
     * still waiting to be uploaded (so nothing is ever lost).
     */
    syncCache: function (serverDesigns) {
      var uid = String(CONFIG.userId);
      var keep = readCache().filter(function (e) {
        return isLegacyEntry(e) || (e && e._sf && String(e.userId) !== uid);
      });
      return writeCache(keep.concat(serverDesigns.map(toCacheEntry)));
    }
  };
})();

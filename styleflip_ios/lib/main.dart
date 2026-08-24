import 'package:flutter/material.dart';
import 'package:webview_flutter/webview_flutter.dart';
import 'package:webview_flutter_wkwebview/webview_flutter_wkwebview.dart';

const String kSiteUrl = 'http://192.168.1.83:4200/';
// const String kSiteUrl = 'http://192.168.1.9:4200/';

// const String kSiteUrl = 'https://styleflip-designer.netlify.app/';

void main() {
  runApp(const MyApp());
}

class MyApp extends StatelessWidget {
  const MyApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'StyleFlip',
      debugShowCheckedModeBanner: false,
      theme: ThemeData(
        colorScheme: ColorScheme.fromSeed(seedColor: Colors.deepPurple),
      ),
      home: const WebViewHomePage(),
    );
  }
}

class WebViewHomePage extends StatefulWidget {
  const WebViewHomePage({super.key});

  @override
  State<WebViewHomePage> createState() => _WebViewHomePageState();
}

class _WebViewHomePageState extends State<WebViewHomePage> {
  late final WebViewController _controller;
  bool _isLoading = true;
  String? _error;

  @override
  void initState() {
    super.initState();
    _controller = WebViewController()
      ..setJavaScriptMode(JavaScriptMode.unrestricted)
      ..setBackgroundColor(Colors.white)
      ..setNavigationDelegate(
        NavigationDelegate(
          onPageStarted: (_) => setState(() {
            _isLoading = true;
            _error = null;
          }),
          onPageFinished: (_) => setState(() => _isLoading = false),
          onWebResourceError: (error) => setState(() {
            _isLoading = false;
            _error =
                'Failed to load: ${error.description}\n\nCheck your internet connection.';
          }),
        ),
      );

    // WKWebView keeps its own HTTP cache across app launches - a plain
    // loadRequest can silently serve a stale cached main.js from a previous
    // run even on a fresh app install/launch, which made JS-side fixes
    // during active development look like they "didn't work" when the
    // WebView just hadn't actually re-fetched them yet. Force a clean fetch
    // every launch while pointed at the local dev server.
    _controller
        .clearCache()
        .catchError((_) {})
        .whenComplete(() => _controller.loadRequest(Uri.parse(kSiteUrl)));

    // iOS's edge-swipe back gesture recognizer sometimes fails to reset,
    // which blocks subsequent taps inside the WebView. It's unused here
    // (single-page app), so disable it.
    final platform = _controller.platform;
    if (platform is WebKitWebViewController) {
      platform.setAllowsBackForwardNavigationGestures(false);
      // WKWebView's long-press link-preview gesture recognizer competes with
      // the page's own touch handlers on real devices, blocking taps on
      // links and drag gestures on the editor's sliders.
      platform.setAllowsLinkPreview(false);
    }
  }

  Future<void> _reload() async {
    setState(() => _error = null);
    await _controller.reload();
  }

  @override
  Widget build(BuildContext context) {
    return SafeArea(
      child: Scaffold(
        body: Stack(
          children: [
            WebViewWidget(controller: _controller),
            if (_isLoading) const Center(child: CircularProgressIndicator()),
            if (_error != null)
              Container(
                color: Colors.white,
                alignment: Alignment.center,
                padding: const EdgeInsets.all(24),
                child: Column(
                  mainAxisSize: MainAxisSize.min,
                  children: [
                    const Icon(Icons.wifi_off, size: 48, color: Colors.grey),
                    const SizedBox(height: 16),
                    Text(_error!, textAlign: TextAlign.center),
                    const SizedBox(height: 16),
                    ElevatedButton(
                      onPressed: _reload,
                      child: const Text('Retry'),
                    ),
                  ],
                ),
              ),
          ],
        ),
      ),
    );
  }
}

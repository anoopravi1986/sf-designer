import Flutter
import UIKit
import WebKit

@main
@objc class AppDelegate: FlutterAppDelegate {
  override func application(
    _ application: UIApplication,
    didFinishLaunchingWithOptions launchOptions: [UIApplication.LaunchOptionsKey: Any]?
  ) -> Bool {
    GeneratedPluginRegistrant.register(with: self)
    let result = super.application(application, didFinishLaunchingWithOptions: launchOptions)
    startWebViewTouchFix()
    return result
  }

  // WKWebView's scrollView defers touches by default to decide tap vs. scroll,
  // which breaks drag-based controls (sliders, canvas drag) in the embedded
  // editor. The embedded WKWebView is created asynchronously by the Flutter
  // plugin, so poll briefly for it and disable the delay once found.
  private func startWebViewTouchFix() {
    var attempts = 0
    Timer.scheduledTimer(withTimeInterval: 0.3, repeats: true) { [weak self] timer in
      attempts += 1
      let fixedAny = self?.disableScrollDelay(in: self?.window) ?? false
      if fixedAny || attempts > 20 {
        timer.invalidate()
      }
    }
  }

  @discardableResult
  private func disableScrollDelay(in view: UIView?) -> Bool {
    guard let view = view else { return false }
    var found = false
    if let webView = view as? WKWebView {
      webView.scrollView.delaysContentTouches = false
      webView.scrollView.canCancelContentTouches = false
      found = true
    }
    for subview in view.subviews where disableScrollDelay(in: subview) {
      found = true
    }
    return found
  }
}

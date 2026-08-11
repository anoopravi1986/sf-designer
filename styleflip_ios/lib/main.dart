import 'package:flutter/material.dart';
import 'package:webview_flutter/webview_flutter.dart';

// URL of the Angular dev server (`ng serve`), exposed via an ngrok tunnel.
// Using a tunnel instead of the LAN IP avoids Wi-Fi client/AP isolation
// issues (common on mobile hotspot/dongle networks) since both the Mac
// and the phone only need internet access, not direct LAN reachability.
// This URL changes every time ngrok restarts — update it when that happens.
const String kDevServerUrl = 'https://1383-2401-4900-1c7b-330f-b071-384d-38c5-efe6.ngrok-free.app';

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
      theme: ThemeData(colorScheme: ColorScheme.fromSeed(seedColor: Colors.deepPurple)),
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
            _error = 'Failed to load: ${error.description}\n\n'
                'Make sure `ng serve` is running and your device is on the same Wi-Fi as this Mac.';
          }),
        ),
      )
      ..loadRequest(Uri.parse(kDevServerUrl));
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
                    ElevatedButton(onPressed: _reload, child: const Text('Retry')),
                  ],
                ),
              ),
          ],
        ),
      ),
    );
  }
}

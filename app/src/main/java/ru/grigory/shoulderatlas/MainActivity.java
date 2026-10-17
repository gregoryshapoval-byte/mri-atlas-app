package ru.grigory.shoulderatlas;

import android.app.Activity;
import android.os.Bundle;
import android.os.Build;
import android.content.Intent;
import android.net.Uri;
import android.graphics.Color;
import android.view.WindowInsets;
import android.widget.FrameLayout;
import android.webkit.*;
import java.io.*;
import java.util.Collections;

public class MainActivity extends Activity {
 private static final String HOST="appassets.androidplatform.net";
 private WebView web;
 @Override public void onCreate(Bundle state){
  super.onCreate(state);
  FrameLayout frame=new FrameLayout(this);frame.setBackgroundColor(Color.rgb(238,241,240));
  if(Build.VERSION.SDK_INT>=30){getWindow().setDecorFitsSystemWindows(false);frame.setOnApplyWindowInsetsListener((v,insets)->{android.graphics.Insets s=insets.getInsets(WindowInsets.Type.systemBars()|WindowInsets.Type.displayCutout());v.setPadding(s.left,s.top,s.right,s.bottom);return insets;});}
  web=new WebView(this);frame.addView(web,new FrameLayout.LayoutParams(-1,-1));setContentView(frame);
  WebSettings s=web.getSettings();s.setJavaScriptEnabled(true);s.setDomStorageEnabled(true);s.setAllowFileAccess(false);s.setAllowContentAccess(false);s.setMixedContentMode(WebSettings.MIXED_CONTENT_NEVER_ALLOW);s.setSupportMultipleWindows(false);s.setMediaPlaybackRequiresUserGesture(true);
  web.addJavascriptInterface(new Object(){@JavascriptInterface public void setImmersive(boolean enabled){runOnUiThread(()->{if(Build.VERSION.SDK_INT>=30){android.view.WindowInsetsController c=getWindow().getInsetsController();if(c!=null){c.setSystemBarsBehavior(android.view.WindowInsetsController.BEHAVIOR_SHOW_TRANSIENT_BARS_BY_SWIPE);if(enabled)c.hide(WindowInsets.Type.systemBars());else c.show(WindowInsets.Type.systemBars());}}else{getWindow().getDecorView().setSystemUiVisibility(enabled?5894:0);}});}},"AtlasNative");
  web.setWebChromeClient(new WebChromeClient());
  web.setWebViewClient(new WebViewClient(){
   @Override public WebResourceResponse shouldInterceptRequest(WebView view,WebResourceRequest request){
    Uri u=request.getUrl();
    if(!"https".equals(u.getScheme())||!HOST.equals(u.getHost()))return blocked();
    String path=u.getPath();if(path==null||!path.startsWith("/assets/")||path.contains("..")||path.contains("\\"))return blocked();
    String file=path.substring(8);String mime=file.endsWith(".js")?"text/javascript":file.endsWith(".css")?"text/css":file.endsWith(".html")?"text/html":file.endsWith(".png")?"image/png":file.endsWith(".jpg")?"image/jpeg":file.endsWith(".json")?"application/json":"text/plain";
    try{return new WebResourceResponse(mime,"UTF-8",200,"OK",Collections.singletonMap("Cache-Control","no-cache"),getAssets().open(file));}catch(IOException e){return new WebResourceResponse("text/plain","UTF-8",404,"Not Found",Collections.emptyMap(),new ByteArrayInputStream(new byte[0]));}
   }
   @Override public boolean shouldOverrideUrlLoading(WebView v,WebResourceRequest r){
    Uri u=r.getUrl();if("https".equals(u.getScheme())&&HOST.equals(u.getHost()))return false;
    if(r.isForMainFrame()&&"https".equals(u.getScheme()))try{startActivity(new Intent(Intent.ACTION_VIEW,u));}catch(android.content.ActivityNotFoundException ignored){}
    return true;
   }
  });
  web.loadUrl("https://"+HOST+"/assets/index.html");
 }
 private WebResourceResponse blocked(){return new WebResourceResponse("text/plain","UTF-8",403,"Forbidden",Collections.emptyMap(),new ByteArrayInputStream(new byte[0]));}
 @Override public void onBackPressed(){web.evaluateJavascript("(()=>{const d=document.querySelector('dialog[open]');if(d){d.close();return true;}if(window.exitAtlasFullscreen&&window.exitAtlasFullscreen())return true;return false;})()",value->{if(!"true".equals(value)){if(web.canGoBack())web.goBack();else finish();}});}
 @Override protected void onPause(){web.onPause();web.pauseTimers();super.onPause();}
 @Override protected void onResume(){super.onResume();if(web!=null){web.onResume();web.resumeTimers();}}
 @Override protected void onDestroy(){if(web!=null){web.stopLoading();web.destroy();}super.onDestroy();}
}


package com.cbrevik;

import android.app.Activity;
import android.view.WindowManager;

import com.facebook.react.bridge.Promise;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.Callback;

public class KeyboardPaddingViewModule extends ReactContextBaseJavaModule {

  private final ReactApplicationContext reactContext;

  public KeyboardPaddingViewModule(ReactApplicationContext reactContext) {
    super(reactContext);
    this.reactContext = reactContext;
  }

  @Override
  public String getName() {
    return "KeyboardPaddingView";
  }

  @ReactMethod
  public void autoResizeWindow(final Promise promise) {
    final Activity activity = getCurrentActivity();

    if (activity == null) {
      promise.resolve(false);
    }

    promise.resolve(
        activity.getWindow().getAttributes().softInputMode == WindowManager.LayoutParams.SOFT_INPUT_ADJUST_RESIZE);
  }
}
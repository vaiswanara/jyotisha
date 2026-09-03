/**
 * Cross-browser file download helper.
 * 
 * Specifically fixes iOS Safari / WebKit error:
 * "The operation couldn't be completed. (WebKitBlobResource error 1.)"
 * 
 * Root Cause: In WebKit/Safari, calling URL.revokeObjectURL synchronously right after a.click()
 * destroys the blob URL before the browser's download manager can read and save it.
 * 
 * Solution:
 * 1. Append the <a> element to document.body (required by WebKit).
 * 2. Delay URL.revokeObjectURL and DOM cleanup by 60 seconds.
 */

export const triggerDownload = (content, filename, mimeType = "application/json;charset=utf-8") => {
  if (!content || !filename) return;

  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  
  // Required for WebKit/iOS Safari
  document.body.appendChild(a);
  a.click();

  // Safely cleanup after Safari has initiated the download stream
  setTimeout(() => {
    try {
      if (document.body.contains(a)) {
        document.body.removeChild(a);
      }
      URL.revokeObjectURL(url);
    } catch (e) {
      console.warn("Download cleanup error:", e);
    }
  }, 60000);
};

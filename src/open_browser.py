# Helpful function to port from other games/tools
import platform, os

def open_browser():
  system = platform.system().lower()
  url = "http://127.0.0.1:5000/"
  try:
    webbrowser.get()
    browser.open_new(url)
  except Exception:
    # Fallback for macOS
    if system == "darwin":
      os.system(f"open -a 'Google Chrome' {url}")
    # Fallback for Windows
    elif system == "windows":
      os.system(f'start chrome "{url}"')
    # Optional: Fallback for Linux
    elif system == "linux":
      os.system(f'xdg-open "{url}"')
  return

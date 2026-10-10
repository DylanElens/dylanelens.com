const STORAGE_KEY = "theme"

// Dark is the default and is rendered on the server. This runs before paint
// so a stored light preference never flashes dark first.
export const themeScript = `(function(){try{if(localStorage.getItem("${STORAGE_KEY}")==="light")document.documentElement.classList.remove("dark")}catch(e){}})()`

export function toggleTheme() {
  const dark = document.documentElement.classList.toggle("dark")

  try {
    localStorage.setItem(STORAGE_KEY, dark ? "dark" : "light")
  } catch {
    // Storage can be unavailable (private mode); the toggle still works.
  }
}

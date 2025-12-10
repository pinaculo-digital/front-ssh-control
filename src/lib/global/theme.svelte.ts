class ThemeManager {
  theme = $state<"light" | "dark">("light");

  constructor() {
    this.theme = "light";
  }

  setDarkMode() {
    if (window === null || window === undefined) return;
    window.document.querySelector("html")!.setAttribute("data-theme", "dark");
    window.document.querySelector("body")?.classList.add("dark");
    window.document.querySelector("html")?.classList.add("dark");
    this.theme = "dark";
    this.save();
  }

  setLightMode() {
    if (window === null || window === undefined) return;
    window.document.querySelector("html")!.setAttribute("data-theme", "light");
    window.document.querySelector("body")?.classList.remove("dark");
    window.document.querySelector("html")?.classList.remove("dark");
    this.theme = "light";
    this.save();
  }

  switch() {
    if (this.theme === "dark") {
      this.setLightMode();
      return;
    }
    this.setDarkMode();
  }

  save() {
    localStorage.setItem("current-theme", this.theme);
  }
}

const themeManager = new ThemeManager();

export default themeManager;

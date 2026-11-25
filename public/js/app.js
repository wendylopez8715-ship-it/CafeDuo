const checkBtn = document.getElementById("checkServer");
const statusMsg = document.getElementById("statusMsg");

if (checkBtn && statusMsg) {
  checkBtn.addEventListener("click", async () => {
    try {
      const resp = await fetch("/api/health");
      const data = await resp.json();
      statusMsg.textContent = "Estado: " + data.status + " - " + data.project;
    } catch (error) {
      statusMsg.textContent = "No se pudo conectar con el servidor";
    }
  });
}

(() => {
  const COMPANY = {
    name: "Bennu Healthcare Solutions",
    legalId: "3-101804878",
    address: "Uruca, San José, Costa Rica"
  };

  function imageFormat(dataUrl) {
    return String(dataUrl || "").startsWith("data:image/png") ? "PNG" : "JPEG";
  }

  function safeText(value) {
    const text = String(value ?? "").trim();
    return text || "-";
  }

  window.makePDF = function makePDF(report) {
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF({ unit: "pt", format: "a4", compress: true });
    const width = doc.internal.pageSize.getWidth();
    const height = doc.internal.pageSize.getHeight();
    const margin = 36;
    const contentWidth = width - margin * 2;
    const bottom = 42;
    const lineHeight = 12;
    let y = margin;

    function setFont(size = 9, bold = false, color = [25, 35, 60]) {
      doc.setFont("helvetica", bold ? "bold" : "normal");
      doc.setFontSize(size);
      doc.setTextColor(...color);
    }

    function drawCompactHeader() {
      doc.setFillColor(9, 16, 42);
      doc.rect(0, 0, width, 48, "F");
      setFont(10, true, [235, 240, 255]);
      doc.text(COMPANY.name, margin, 29);
      setFont(9, false, [220, 228, 248]);
      doc.text(`Reporte R#${String(report.consecutivo).padStart(5, "0")}`, width - margin, 29, { align: "right" });
      y = 66;
    }

    function addPage() {
      doc.addPage();
      drawCompactHeader();
    }

    function ensureSpace(required) {
      if (y + required > height - bottom) addPage();
    }

    function drawFirstHeader() {
      const headerHeight = 105;
      doc.setDrawColor(37, 48, 85);
      doc.setFillColor(247, 249, 255);
      doc.roundedRect(margin, y, contentWidth, headerHeight, 8, 8, "FD");

      if (report.logo) {
        try {
          doc.addImage(report.logo, imageFormat(report.logo), margin + 12, y + 16, 138, 68);
        } catch (_) {}
      }

      const textX = report.logo ? margin + 165 : margin + 14;
      setFont(13, true);
      doc.text(COMPANY.name, textX, y + 25);
      setFont(9);
      doc.text(`Cédula Jurídica: ${COMPANY.legalId}`, textX, y + 44);
      doc.text(COMPANY.address, textX, y + 59);
      doc.text(`Ingeniería: ${safeText(report.tecnicoBHS)}`, textX, y + 74);
      doc.text(`${safeText(report.phoneBHS)} · ${safeText(report.emailBHS)}`, textX, y + 89);

      y += headerHeight + 12;
      doc.setFillColor(9, 16, 42);
      doc.roundedRect(margin, y, contentWidth, 48, 7, 7, "F");
      setFont(13, true, [255, 255, 255]);
      doc.text("REPORTE DE SERVICIO", margin + 12, y + 20);
      doc.text(`R#${String(report.consecutivo).padStart(5, "0")}`, width - margin - 12, y + 20, { align: "right" });
      setFont(8.5, false, [225, 232, 250]);
      doc.text(
        `Fecha: ${safeText(report.fecha)}   Hora: ${safeText(report.horaIni)}-${safeText(report.horaFin)}   Tiempo: ${safeText(report.duracion)}`,
        margin + 12,
        y + 37
      );
      y += 60;
    }

    function drawSectionTitle(title, continuation = false) {
      ensureSpace(30);
      doc.setFillColor(225, 232, 248);
      doc.roundedRect(margin, y, contentWidth, 24, 5, 5, "F");
      setFont(9, true);
      doc.text(continuation ? `${title} (continuación)` : title, margin + 9, y + 16);
      y += 28;
    }

    function drawRows(title, items) {
      let continuation = false;
      drawSectionTitle(title);
      for (const [label, rawValue] of items) {
        const value = safeText(rawValue);
        const labelWidth = 120;
        const lines = doc.splitTextToSize(value, contentWidth - labelWidth - 22);
        const rowHeight = Math.max(30, lines.length * lineHeight + 14);
        if (y + rowHeight > height - bottom) {
          addPage();
          continuation = true;
          drawSectionTitle(title, continuation);
        }
        doc.setDrawColor(205, 214, 235);
        doc.setFillColor(252, 253, 255);
        doc.roundedRect(margin, y, contentWidth, rowHeight, 4, 4, "FD");
        setFont(8.5, true, [70, 84, 115]);
        doc.text(label, margin + 9, y + 18);
        setFont(9);
        doc.text(lines, margin + labelWidth, y + 18);
        y += rowHeight + 4;
      }
      y += 7;
    }

    function drawLongText(title, rawText) {
      const lines = doc.splitTextToSize(safeText(rawText), contentWidth - 20);
      let offset = 0;
      let continuation = false;

      while (offset < lines.length) {
        const available = height - bottom - y;
        if (available < 70) {
          addPage();
          continuation = true;
        }
        const maximumLines = Math.max(1, Math.floor((height - bottom - y - 43) / lineHeight));
        const chunk = lines.slice(offset, offset + maximumLines);
        const boxHeight = 32 + chunk.length * lineHeight;
        doc.setDrawColor(205, 214, 235);
        doc.setFillColor(252, 253, 255);
        doc.roundedRect(margin, y, contentWidth, boxHeight, 6, 6, "FD");
        setFont(9, true);
        doc.text(continuation ? `${title} (continuación)` : title, margin + 10, y + 17);
        setFont(9);
        doc.text(chunk, margin + 10, y + 34);
        y += boxHeight + 10;
        offset += chunk.length;
        continuation = true;
      }
    }

    function drawPhotos(photos) {
      if (!photos?.length) return;
      drawSectionTitle("FOTOGRAFÍAS");
      photos.forEach((photo, index) => {
        if (height - bottom - y < 190) {
          addPage();
          drawSectionTitle("FOTOGRAFÍAS", index > 0);
        }
        const maxImageHeight = Math.min(330, height - bottom - y - 34);
        let imageWidth = contentWidth - 20;
        let imageHeight = maxImageHeight;
        try {
          const properties = doc.getImageProperties(photo);
          const ratio = properties.width / properties.height;
          imageHeight = Math.min(maxImageHeight, imageWidth / ratio);
          imageWidth = imageHeight * ratio;
          if (imageWidth > contentWidth - 20) {
            imageWidth = contentWidth - 20;
            imageHeight = imageWidth / ratio;
          }
        } catch (_) {}
        const boxHeight = imageHeight + 34;
        doc.setDrawColor(205, 214, 235);
        doc.roundedRect(margin, y, contentWidth, boxHeight, 6, 6);
        setFont(8.5, true);
        doc.text(`Foto ${index + 1}`, margin + 10, y + 17);
        try {
          doc.addImage(
            photo,
            imageFormat(photo),
            margin + (contentWidth - imageWidth) / 2,
            y + 24,
            imageWidth,
            imageHeight
          );
        } catch (_) {
          setFont(9, false, [180, 40, 40]);
          doc.text("No fue posible incorporar esta fotografía.", margin + 10, y + 38);
        }
        y += boxHeight + 10;
      });
    }

    function drawSignature() {
      ensureSpace(150);
      const boxHeight = 135;
      doc.setDrawColor(205, 214, 235);
      doc.setFillColor(252, 253, 255);
      doc.roundedRect(margin, y, contentWidth, boxHeight, 6, 6, "FD");
      setFont(9, true);
      doc.text("FIRMA DEL CLIENTE / CONFORMIDAD", margin + 10, y + 18);
      if (report.firma) {
        try {
          doc.addImage(report.firma, "PNG", margin + 22, y + 30, 300, 88);
        } catch (_) {}
      } else {
        setFont(9, false, [100, 110, 130]);
        doc.text("Sin firma registrada", margin + 10, y + 55);
      }
      y += boxHeight + 8;
    }

    drawFirstHeader();
    drawRows("DATOS DEL CLIENTE", [
      ["Cliente", report.cliente],
      ["Responsable", report.responsable],
      ["Correo", report.correo]
    ]);
    drawRows("DATOS DEL EQUIPO", [
      ["Equipo", report.equipo],
      ["Marca / Modelo", `${safeText(report.marca)} / ${safeText(report.modelo)}`],
      ["Serie / Activo", `${safeText(report.serie)} / ${safeText(report.activo)}`],
      ["Servicio", report.actuacion],
      ["Estado final", report.estado],
      ["Cantidad", report.cantidad],
      ["Horas trabajadas", report.horas],
      ["Repuestos", report.repuestos]
    ]);
    drawLongText("OBSERVACIONES / DIAGNÓSTICO", report.acciones);
    drawPhotos(report.fotos);
    drawSignature();

    const pages = doc.getNumberOfPages();
    for (let page = 1; page <= pages; page += 1) {
      doc.setPage(page);
      setFont(8, false, [105, 115, 135]);
      doc.text(`Página ${page} de ${pages}`, width - margin, height - 20, { align: "right" });
      doc.text(`R#${String(report.consecutivo).padStart(5, "0")}`, margin, height - 20);
    }

    const filename = `OT_${String(report.consecutivo).padStart(5, "0")}_${safeText(report.equipo)}_${safeText(report.marca)}_${safeText(report.serie)}_${safeText(report.activo)}.pdf`
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[^a-z0-9._-]+/gi, "_");

    return { blob: doc.output("blob"), name: filename };
  };
})();

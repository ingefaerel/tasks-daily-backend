// src/components/ExportPDFButton.jsx
import React from "react";
import { jsPDF } from "jspdf";
import { format } from "date-fns";

const ExportPDFButton = ({ date, areas, notes, filterCompletedTasks }) => {
  const handleExportToPDF = () => {
    const doc = new jsPDF();
    const formattedDate = format(date, "yyyy-MM-dd");
    const fileName = `tasks_done_${formattedDate}.pdf`;

    doc.setFontSize(16);
    doc.text(`Tasks Completed on ${formattedDate}`, 10, 10);

    let yPosition = 20;

    areas.forEach((area) => {
      const completedTasks = filterCompletedTasks(area);
      if (completedTasks.length > 0) {
        doc.setFontSize(14);
        doc.text(area.name, 10, yPosition);
        yPosition += 10;

        completedTasks.forEach(({ task, subcategory }) => {
          doc.setFontSize(12);
          doc.text(`- ${subcategory}: ${task}`, 15, yPosition);
          yPosition += 8;

          const taskNote = notes[formattedDate]?.[task];
          if (taskNote) {
            doc.setFontSize(10);
            doc.text(`  Note: ${taskNote}`, 20, yPosition);
            yPosition += 8;
          }
        });
      }
    });

    doc.save(fileName);
  };

  return (
    <button onClick={handleExportToPDF} className="export-pdf">
      Export to PDF
    </button>
  );
};

export default ExportPDFButton;
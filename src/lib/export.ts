import * as XLSX from "xlsx"
import jsPDF from "jspdf"
import autoTable from "jspdf-autotable"

// Simple Excel export: rows is an array of objects
export function exportToExcel(filename: string, rows: any[]) {
  const ws = XLSX.utils.json_to_sheet(rows)
  const wb = XLSX.utils.book_new()
  XLSX.utils.book_append_sheet(wb, ws, "Sheet1")
  XLSX.writeFile(wb, `${sanitize(filename)}.xlsx`)
}

// PDF export using columns and rows (columns: [{header, dataKey}])
export function exportToPDF(filename: string, columns: { header: string; dataKey: string }[], rows: any[]) {
  const doc = new jsPDF({ orientation: "portrait", unit: "pt", format: "a4" })
  doc.setFontSize(14)
  doc.text(filename, 40, 40)
  autoTable(doc, {
    head: [columns.map(c => c.header)],
    body: rows.map(r => columns.map(c => String(r[c.dataKey] ?? ""))),
    startY: 60,
    styles: { fontSize: 10 },
    headStyles: { fillColor: [30, 136, 229] },
  })
  doc.save(`${sanitize(filename)}.pdf`)
}

function sanitize(name: string) {
  return name.replace(/[^a-z0-9-_]+/gi, "_")
}

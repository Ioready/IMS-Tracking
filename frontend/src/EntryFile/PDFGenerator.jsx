import React from "react";
import PropTypes from "prop-types";
import { Document, Page, Text, View, StyleSheet, pdf } from "@react-pdf/renderer";
import { saveAs } from "file-saver"; 

const styles = StyleSheet.create({
  page: {
    flexDirection: "row",
    backgroundColor: "#ffffff",
  },
  section: {
    margin: 10,
    padding: 10,
    flexGrow: 1,
  },
  header: {
    fontSize: 20,
    marginBottom: 10,
  },
  row: {
    flexDirection: "row",
    borderBottomWidth: 1,
    borderBottomColor: "#cccccc",
    alignItems: "center",
    padding: 5,
  },
  cell: {
    flex: 1,
    padding: 5,
  },
});

const PDFGenerator = ({ data, columnTitles }) => {
  const generatePDF = async () => {
    const rows = data.map(item => Object.values(item)); // Convert object values to array
    const doc = (
      <Document>
        <Page size="A4" style={styles.page}>
          <View style={styles.section}>
            <Text style={styles.header}>Table Data</Text>
            {/* Render column titles */}
            <View style={styles.row}>
              {columnTitles.map((title, index) => (
                <View key={index} style={styles.cell}>
                  <Text>{title}</Text>
                </View>
              ))}
            </View>
            {/* Render data rows */}
            {rows.map((rowData, rowIndex) => (
              <View key={rowIndex} style={styles.row}>
                {rowData.map((cellData, cellIndex) => (
                  <View key={cellIndex} style={styles.cell}>
                    {/* Check if the cellData is an array or a string */}
                    {Array.isArray(cellData) ? (
                      // If it's an array, join its elements into a string
                      <Text>{cellData.join(", ")}</Text>
                    ) : (
                      // If it's a string, render it directly
                      <Text>{cellData}</Text>
                    )}
                  </View>
                ))}
              </View>
            ))}
          </View>
        </Page>
      </Document>
    );

    const pdfBlob = await pdf(doc).toBlob();
    saveAs(pdfBlob, "table_data.pdf"); 
  };

  return (
    <button onClick={generatePDF} style={{ display: "none" }}>
      Download PDF
    </button>
  );
};

PDFGenerator.propTypes = {
  data: PropTypes.arrayOf(PropTypes.object).isRequired, // Expecting array of objects
  columnTitles: PropTypes.arrayOf(PropTypes.string).isRequired,
};

export default PDFGenerator;

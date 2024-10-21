import React from 'react';
import PropTypes from 'prop-types';
import { PDFDownloadLink, Document, Page, View, StyleSheet } from '@react-pdf/renderer';
import Barcode from 'react-barcode';
// import { saveAs } from 'file-saver';

// Define styles for PDF
const styles = StyleSheet.create({
  page: {
    flexDirection: 'row',
    backgroundColor: '#ffffff',
  },
  section: {
    margin: 10,
    padding: 10,
    flexGrow: 1,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  barcodeImage: {
    width: 200, // Adjust the width of the barcode image as needed
    height: 100, // Adjust the height of the barcode image as needed
  },
});

const generatePDF = ({ barcodeValue }) => (
  <PDFDownloadLink
    document={
      <Document>
        <Page size="A4" style={styles.page}>
          <View style={styles.section}>
            {/* Render the barcode image directly in the PDF */}
            <Barcode value={barcodeValue} />
          </View>
        </Page>
      </Document>
    }
    fileName="barcode.pdf"
  >
    {/* Display a button to trigger the download */}
    {({ loading }) =>
      loading ? 'Generating PDF...' : 'Download PDF'
    }
  </PDFDownloadLink>
);

generatePDF.propTypes = {
  barcodeValue: PropTypes.string.isRequired,
};

export default generatePDF;

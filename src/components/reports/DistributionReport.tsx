
import React from 'react';
import { Document, Page, Text, View, StyleSheet, PDFDownloadLink } from '@react-pdf/renderer';
import { Button } from '@/components/ui/button';

// Define the member type for type safety
type Member = {
  name: string;
  allocation: number;
  systemShare: string;
  initialCost: string;
  monthlyContribution: string;
  status: string;
};

// Create styles for PDF
const styles = StyleSheet.create({
  page: {
    flexDirection: 'column',
    backgroundColor: '#ffffff',
    padding: 30,
  },
  title: {
    fontSize: 24,
    marginBottom: 20,
    textAlign: 'center',
    fontWeight: 'bold',
  },
  subtitle: {
    fontSize: 16,
    marginBottom: 10,
    fontWeight: 'bold',
  },
  section: {
    margin: 10,
    padding: 10,
    flexGrow: 1,
  },
  table: {
    display: 'flex',
    width: 'auto',
    borderStyle: 'solid',
    borderColor: '#bfbfbf',
    borderWidth: 1,
    borderRightWidth: 0,
    borderBottomWidth: 0,
  },
  tableRow: {
    flexDirection: 'row',
  },
  tableColHeader: {
    width: '16.66%',
    borderStyle: 'solid',
    borderColor: '#bfbfbf',
    borderBottomColor: '#000',
    borderWidth: 1,
    borderLeftWidth: 0,
    borderTopWidth: 0,
    padding: 5,
    backgroundColor: '#f0f0f0',
    fontSize: 10,
    fontWeight: 'bold',
  },
  tableCol: {
    width: '16.66%',
    borderStyle: 'solid',
    borderColor: '#bfbfbf',
    borderWidth: 1,
    borderLeftWidth: 0,
    borderTopWidth: 0,
    padding: 5,
    fontSize: 9,
  },
  info: {
    marginTop: 20,
    padding: 10,
    backgroundColor: '#f9f9f9',
    borderRadius: 5,
    fontSize: 10,
  },
  highlight: {
    backgroundColor: '#f2f8ff',
  },
});

// Create PDF Document component
const DistributionReportPDF = ({ members }: { members: Member[] }) => (
  <Document>
    <Page size="A4" style={styles.page}>
      <Text style={styles.title}>Community Solar Cost Distribution Report</Text>
      
      <View style={styles.section}>
        <Text style={styles.subtitle}>Member Allocation and Contributions</Text>
        
        <View style={styles.table}>
          {/* Table Header */}
          <View style={styles.tableRow}>
            <View style={styles.tableColHeader}>
              <Text>Member</Text>
            </View>
            <View style={styles.tableColHeader}>
              <Text>Allocation %</Text>
            </View>
            <View style={styles.tableColHeader}>
              <Text>System Share</Text>
            </View>
            <View style={styles.tableColHeader}>
              <Text>Initial Cost</Text>
            </View>
            <View style={styles.tableColHeader}>
              <Text>Monthly</Text>
            </View>
            <View style={styles.tableColHeader}>
              <Text>Status</Text>
            </View>
          </View>
          
          {/* Table Data */}
          {members.map((member, index) => (
            <View key={index} style={[styles.tableRow, member.name === "You" ? styles.highlight : {}]}>
              <View style={styles.tableCol}>
                <Text>{member.name}</Text>
              </View>
              <View style={styles.tableCol}>
                <Text>{member.allocation}%</Text>
              </View>
              <View style={styles.tableCol}>
                <Text>{member.systemShare}</Text>
              </View>
              <View style={styles.tableCol}>
                <Text>{member.initialCost}</Text>
              </View>
              <View style={styles.tableCol}>
                <Text>{member.monthlyContribution}</Text>
              </View>
              <View style={styles.tableCol}>
                <Text>{member.status}</Text>
              </View>
            </View>
          ))}
        </View>
        
        <View style={styles.info}>
          <Text style={styles.subtitle}>Cost Distribution Method</Text>
          <Text>Costs are distributed based on each member's energy consumption needs and the percentage of the system allocated to them. Monthly contributions cover maintenance and insurance costs.</Text>
        </View>
        
        <View style={styles.info}>
          <Text style={styles.subtitle}>Project Summary</Text>
          <Text>Total System Size: 48kW</Text>
          <Text>Total Project Cost: ₹30,00,000</Text>
          <Text>Maintenance Fund: ₹15,000</Text>
          <Text>Estimated Annual Production: 76,800 kWh</Text>
          <Text>Generated on: {new Date().toLocaleDateString()}</Text>
        </View>
      </View>
    </Page>
  </Document>
);

// Export Button Component that wraps the PDF download link
const ExportDistributionReportButton = ({ members }: { members: Member[] }) => (
  <PDFDownloadLink 
    document={<DistributionReportPDF members={members} />} 
    fileName="community-solar-distribution-report.pdf"
  >
    {({ loading }) => (
      <Button variant="outline" className="button-animation" disabled={loading}>
        {loading ? 'Generating PDF...' : 'Export Distribution Report'}
      </Button>
    )}
  </PDFDownloadLink>
);

export default ExportDistributionReportButton;

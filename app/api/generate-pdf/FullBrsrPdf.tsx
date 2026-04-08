import React from "react";
import { Document, Page, Text, View, StyleSheet } from "@react-pdf/renderer";
const styles = StyleSheet.create({
  page: { padding: 30, fontSize: 9, fontFamily: "Helvetica", color: "#1E293B" },
  p: { marginBottom: 6, lineHeight: 1.4 },
  table: { width: "100%", borderTop: "1px solid #C8D8D0", borderLeft: "1px solid #C8D8D0", marginBottom: 15 },
  row: { flexDirection: "row", borderBottom: "1px solid #C8D8D0" },
  cell: { borderRight: "1px solid #C8D8D0", padding: 4 },
});
export const FullBrsrPdf = () => (
  <Document>
    <Page size="A4" style={styles.page}>
      <Text style={styles.p}>Section A: General  Disclosures</Text>
      <Text style={styles.p}>I: Details of the listed entity</Text>
      <View style={styles.table}>
        <View style={styles.row}>
          <View style={{...styles.cell, width: "33.333333333333336%"}}><Text>1</Text></View>
          <View style={{...styles.cell, width: "33.333333333333336%"}}><Text>Corporate Identity Number (CIN) of the Listed Entity</Text></View>
          <View style={{...styles.cell, width: "33.333333333333336%"}}><Text></Text></View>
        </View>
        <View style={styles.row}>
          <View style={{...styles.cell, width: "33.333333333333336%"}}><Text>2</Text></View>
          <View style={{...styles.cell, width: "33.333333333333336%"}}><Text>Name of the Listed Entity</Text></View>
          <View style={{...styles.cell, width: "33.333333333333336%"}}><Text></Text></View>
        </View>
        <View style={styles.row}>
          <View style={{...styles.cell, width: "33.333333333333336%"}}><Text>3</Text></View>
          <View style={{...styles.cell, width: "33.333333333333336%"}}><Text>Year of incorporation</Text></View>
          <View style={{...styles.cell, width: "33.333333333333336%"}}><Text></Text></View>
        </View>
        <View style={styles.row}>
          <View style={{...styles.cell, width: "33.333333333333336%"}}><Text>4</Text></View>
          <View style={{...styles.cell, width: "33.333333333333336%"}}><Text>Registered office address</Text></View>
          <View style={{...styles.cell, width: "33.333333333333336%"}}><Text></Text></View>
        </View>
        <View style={styles.row}>
          <View style={{...styles.cell, width: "33.333333333333336%"}}><Text>5</Text></View>
          <View style={{...styles.cell, width: "33.333333333333336%"}}><Text>Corporate address</Text></View>
          <View style={{...styles.cell, width: "33.333333333333336%"}}><Text></Text></View>
        </View>
        <View style={styles.row}>
          <View style={{...styles.cell, width: "33.333333333333336%"}}><Text>6</Text></View>
          <View style={{...styles.cell, width: "33.333333333333336%"}}><Text>E-mail</Text></View>
          <View style={{...styles.cell, width: "33.333333333333336%"}}><Text></Text></View>
        </View>
        <View style={styles.row}>
          <View style={{...styles.cell, width: "33.333333333333336%"}}><Text>7</Text></View>
          <View style={{...styles.cell, width: "33.333333333333336%"}}><Text>Telephone</Text></View>
          <View style={{...styles.cell, width: "33.333333333333336%"}}><Text></Text></View>
        </View>
        <View style={styles.row}>
          <View style={{...styles.cell, width: "33.333333333333336%"}}><Text>8</Text></View>
          <View style={{...styles.cell, width: "33.333333333333336%"}}><Text>Website</Text></View>
          <View style={{...styles.cell, width: "33.333333333333336%"}}><Text></Text></View>
        </View>
        <View style={styles.row}>
          <View style={{...styles.cell, width: "33.333333333333336%"}}><Text>9</Text></View>
          <View style={{...styles.cell, width: "33.333333333333336%"}}><Text>Financial year for which reporting is being done</Text></View>
          <View style={{...styles.cell, width: "33.333333333333336%"}}><Text></Text></View>
        </View>
        <View style={styles.row}>
          <View style={{...styles.cell, width: "33.333333333333336%"}}><Text>10</Text></View>
          <View style={{...styles.cell, width: "33.333333333333336%"}}><Text>Name of the Stock Exchange(s) where shares are listed</Text></View>
          <View style={{...styles.cell, width: "33.333333333333336%"}}><Text></Text></View>
        </View>
        <View style={styles.row}>
          <View style={{...styles.cell, width: "33.333333333333336%"}}><Text>11</Text></View>
          <View style={{...styles.cell, width: "33.333333333333336%"}}><Text>Paid-up Capital</Text></View>
          <View style={{...styles.cell, width: "33.333333333333336%"}}><Text></Text></View>
        </View>
        <View style={styles.row}>
          <View style={{...styles.cell, width: "33.333333333333336%"}}><Text>12</Text></View>
          <View style={{...styles.cell, width: "33.333333333333336%"}}><Text></Text></View>
          <View style={{...styles.cell, width: "33.333333333333336%"}}><Text></Text></View>
        </View>
        <View style={styles.row}>
          <View style={{...styles.cell, width: "33.333333333333336%"}}><Text>12</Text></View>
          <View style={{...styles.cell, width: "33.333333333333336%"}}><Text>Name of the Person</Text></View>
          <View style={{...styles.cell, width: "33.333333333333336%"}}><Text></Text></View>
        </View>
        <View style={styles.row}>
          <View style={{...styles.cell, width: "33.333333333333336%"}}><Text>12</Text></View>
          <View style={{...styles.cell, width: "33.333333333333336%"}}><Text>Telephone</Text></View>
          <View style={{...styles.cell, width: "33.333333333333336%"}}><Text></Text></View>
        </View>
        <View style={styles.row}>
          <View style={{...styles.cell, width: "33.333333333333336%"}}><Text>12</Text></View>
          <View style={{...styles.cell, width: "33.333333333333336%"}}><Text>Email address</Text></View>
          <View style={{...styles.cell, width: "33.333333333333336%"}}><Text></Text></View>
        </View>
        <View style={styles.row}>
          <View style={{...styles.cell, width: "33.333333333333336%"}}><Text>13</Text></View>
          <View style={{...styles.cell, width: "33.333333333333336%"}}><Text></Text></View>
          <View style={{...styles.cell, width: "33.333333333333336%"}}><Text></Text></View>
        </View>
        <View style={styles.row}>
          <View style={{...styles.cell, width: "33.333333333333336%"}}><Text>13</Text></View>
          <View style={{...styles.cell, width: "33.333333333333336%"}}><Text></Text></View>
          <View style={{...styles.cell, width: "33.333333333333336%"}}><Text></Text></View>
        </View>
        <View style={styles.row}>
          <View style={{...styles.cell, width: "33.333333333333336%"}}><Text>14</Text></View>
          <View style={{...styles.cell, width: "33.333333333333336%"}}><Text></Text></View>
          <View style={{...styles.cell, width: "33.333333333333336%"}}><Text></Text></View>
        </View>
        <View style={styles.row}>
          <View style={{...styles.cell, width: "33.333333333333336%"}}><Text>15</Text></View>
          <View style={{...styles.cell, width: "33.333333333333336%"}}><Text></Text></View>
          <View style={{...styles.cell, width: "33.333333333333336%"}}><Text></Text></View>
        </View>
      </View>
      <Text style={styles.p}>II: Products/services</Text>
      <Text style={styles.p}>Details of business activities (accounting for 90% of the turnover):</Text>
      <View style={styles.table}>
        <View style={styles.row}>
          <View style={{...styles.cell, width: "25.0%"}}><Text>S. No.</Text></View>
          <View style={{...styles.cell, width: "25.0%"}}><Text>Description of Main Activity</Text></View>
          <View style={{...styles.cell, width: "25.0%"}}><Text></Text></View>
          <View style={{...styles.cell, width: "25.0%"}}><Text></Text></View>
        </View>
        <View style={styles.row}>
          <View style={{...styles.cell, width: "25.0%"}}><Text>1</Text></View>
          <View style={{...styles.cell, width: "25.0%"}}><Text>Manufacturing</Text></View>
          <View style={{...styles.cell, width: "25.0%"}}><Text></Text></View>
          <View style={{...styles.cell, width: "25.0%"}}><Text></Text></View>
        </View>
        <View style={styles.row}>
          <View style={{...styles.cell, width: "25.0%"}}><Text>2</Text></View>
          <View style={{...styles.cell, width: "25.0%"}}><Text>Electricity, gas, steam &amp; air condition supply</Text></View>
          <View style={{...styles.cell, width: "25.0%"}}><Text></Text></View>
          <View style={{...styles.cell, width: "25.0%"}}><Text></Text></View>
        </View>
      </View>
      <Text style={styles.p}>Products/Services sold by the entity (accounting for 90% of the entity’s Turnover):</Text>
      <View style={styles.table}>
        <View style={styles.row}>
          <View style={{...styles.cell, width: "25.0%"}}><Text>S. No.</Text></View>
          <View style={{...styles.cell, width: "25.0%"}}><Text>Product/Service</Text></View>
          <View style={{...styles.cell, width: "25.0%"}}><Text></Text></View>
          <View style={{...styles.cell, width: "25.0%"}}><Text></Text></View>
        </View>
        <View style={styles.row}>
          <View style={{...styles.cell, width: "25.0%"}}><Text>1</Text></View>
          <View style={{...styles.cell, width: "25.0%"}}><Text>Bearing cages, Brass Casting and Automotive Components</Text></View>
          <View style={{...styles.cell, width: "25.0%"}}><Text></Text></View>
          <View style={{...styles.cell, width: "25.0%"}}><Text></Text></View>
        </View>
        <View style={styles.row}>
          <View style={{...styles.cell, width: "25.0%"}}><Text>2</Text></View>
          <View style={{...styles.cell, width: "25.0%"}}><Text>EPC and O &amp; M of Solar Power Plant</Text></View>
          <View style={{...styles.cell, width: "25.0%"}}><Text></Text></View>
          <View style={{...styles.cell, width: "25.0%"}}><Text></Text></View>
        </View>
      </View>
      <Text style={styles.p}>III: Operations</Text>
      <Text style={styles.p}>Number of locations where plants &amp; operations/offices of the entity are situated:</Text>
      <View style={styles.table}>
        <View style={styles.row}>
          <View style={{...styles.cell, width: "25.0%"}}><Text>Location</Text></View>
          <View style={{...styles.cell, width: "25.0%"}}><Text>Number of plants</Text></View>
          <View style={{...styles.cell, width: "25.0%"}}><Text></Text></View>
          <View style={{...styles.cell, width: "25.0%"}}><Text></Text></View>
        </View>
        <View style={styles.row}>
          <View style={{...styles.cell, width: "25.0%"}}><Text>National</Text></View>
          <View style={{...styles.cell, width: "25.0%"}}><Text>2</Text></View>
          <View style={{...styles.cell, width: "25.0%"}}><Text></Text></View>
          <View style={{...styles.cell, width: "25.0%"}}><Text></Text></View>
        </View>
        <View style={styles.row}>
          <View style={{...styles.cell, width: "25.0%"}}><Text>International</Text></View>
          <View style={{...styles.cell, width: "25.0%"}}><Text>-</Text></View>
          <View style={{...styles.cell, width: "25.0%"}}><Text></Text></View>
          <View style={{...styles.cell, width: "25.0%"}}><Text></Text></View>
        </View>
      </View>
      <Text style={styles.p}>Markets served by the entity:</Text>
      <View style={styles.table}>
        <View style={styles.row}>
          <View style={{...styles.cell, width: "50.0%"}}><Text>Number of locations</Text></View>
          <View style={{...styles.cell, width: "50.0%"}}><Text>Number of locations</Text></View>
        </View>
        <View style={styles.row}>
          <View style={{...styles.cell, width: "50.0%"}}><Text>Location</Text></View>
          <View style={{...styles.cell, width: "50.0%"}}><Text>Number</Text></View>
        </View>
        <View style={styles.row}>
          <View style={{...styles.cell, width: "50.0%"}}><Text>National (No. of States)</Text></View>
          <View style={{...styles.cell, width: "50.0%"}}><Text>10</Text></View>
        </View>
        <View style={styles.row}>
          <View style={{...styles.cell, width: "50.0%"}}><Text>International (No. of Countries)</Text></View>
          <View style={{...styles.cell, width: "50.0%"}}><Text>30</Text></View>
        </View>
      </View>
      <Text style={styles.p}>What is the contribution of exports as a percentage of the total turnover of the entity?</Text>
      <Text style={styles.p}>brief on types of customers</Text>
      <Text style={styles.p}>IV : Employees</Text>
      <Text style={styles.p}>Details as at the end of Financial Year:</Text>
      <Text style={styles.p}>A : Employees and workers (including differently abled):</Text>
      <View style={styles.table}>
        <View style={styles.row}>
          <View style={{...styles.cell, width: "14.285714285714286%"}}><Text>S. No.</Text></View>
          <View style={{...styles.cell, width: "14.285714285714286%"}}><Text>Particulars</Text></View>
          <View style={{...styles.cell, width: "14.285714285714286%"}}><Text></Text></View>
          <View style={{...styles.cell, width: "14.285714285714286%"}}><Text></Text></View>
          <View style={{...styles.cell, width: "14.285714285714286%"}}><Text></Text></View>
          <View style={{...styles.cell, width: "14.285714285714286%"}}><Text></Text></View>
          <View style={{...styles.cell, width: "14.285714285714286%"}}><Text></Text></View>
        </View>
        <View style={styles.row}>
          <View style={{...styles.cell, width: "14.285714285714286%"}}><Text>S. No.</Text></View>
          <View style={{...styles.cell, width: "14.285714285714286%"}}><Text>Particulars</Text></View>
          <View style={{...styles.cell, width: "14.285714285714286%"}}><Text></Text></View>
          <View style={{...styles.cell, width: "14.285714285714286%"}}><Text></Text></View>
          <View style={{...styles.cell, width: "14.285714285714286%"}}><Text></Text></View>
          <View style={{...styles.cell, width: "14.285714285714286%"}}><Text></Text></View>
          <View style={{...styles.cell, width: "14.285714285714286%"}}><Text></Text></View>
        </View>
        <View style={styles.row}>
          <View style={{...styles.cell, width: "14.285714285714286%"}}><Text></Text></View>
          <View style={{...styles.cell, width: "14.285714285714286%"}}><Text></Text></View>
          <View style={{...styles.cell, width: "14.285714285714286%"}}><Text></Text></View>
          <View style={{...styles.cell, width: "14.285714285714286%"}}><Text></Text></View>
          <View style={{...styles.cell, width: "14.285714285714286%"}}><Text></Text></View>
          <View style={{...styles.cell, width: "14.285714285714286%"}}><Text></Text></View>
          <View style={{...styles.cell, width: "14.285714285714286%"}}><Text></Text></View>
        </View>
        <View style={styles.row}>
          <View style={{...styles.cell, width: "14.285714285714286%"}}><Text>1.</Text></View>
          <View style={{...styles.cell, width: "14.285714285714286%"}}><Text>Permanent (D)</Text></View>
          <View style={{...styles.cell, width: "14.285714285714286%"}}><Text></Text></View>
          <View style={{...styles.cell, width: "14.285714285714286%"}}><Text></Text></View>
          <View style={{...styles.cell, width: "14.285714285714286%"}}><Text></Text></View>
          <View style={{...styles.cell, width: "14.285714285714286%"}}><Text></Text></View>
          <View style={{...styles.cell, width: "14.285714285714286%"}}><Text></Text></View>
        </View>
        <View style={styles.row}>
          <View style={{...styles.cell, width: "14.285714285714286%"}}><Text>2.</Text></View>
          <View style={{...styles.cell, width: "14.285714285714286%"}}><Text>Other than  Permanent (E)</Text></View>
          <View style={{...styles.cell, width: "14.285714285714286%"}}><Text></Text></View>
          <View style={{...styles.cell, width: "14.285714285714286%"}}><Text></Text></View>
          <View style={{...styles.cell, width: "14.285714285714286%"}}><Text></Text></View>
          <View style={{...styles.cell, width: "14.285714285714286%"}}><Text></Text></View>
          <View style={{...styles.cell, width: "14.285714285714286%"}}><Text></Text></View>
        </View>
        <View style={styles.row}>
          <View style={{...styles.cell, width: "14.285714285714286%"}}><Text>3.</Text></View>
          <View style={{...styles.cell, width: "14.285714285714286%"}}><Text>Total employees  (D + E)</Text></View>
          <View style={{...styles.cell, width: "14.285714285714286%"}}><Text></Text></View>
          <View style={{...styles.cell, width: "14.285714285714286%"}}><Text></Text></View>
          <View style={{...styles.cell, width: "14.285714285714286%"}}><Text></Text></View>
          <View style={{...styles.cell, width: "14.285714285714286%"}}><Text></Text></View>
          <View style={{...styles.cell, width: "14.285714285714286%"}}><Text></Text></View>
        </View>
        <View style={styles.row}>
          <View style={{...styles.cell, width: "14.285714285714286%"}}><Text></Text></View>
          <View style={{...styles.cell, width: "14.285714285714286%"}}><Text></Text></View>
          <View style={{...styles.cell, width: "14.285714285714286%"}}><Text></Text></View>
          <View style={{...styles.cell, width: "14.285714285714286%"}}><Text></Text></View>
          <View style={{...styles.cell, width: "14.285714285714286%"}}><Text></Text></View>
          <View style={{...styles.cell, width: "14.285714285714286%"}}><Text></Text></View>
          <View style={{...styles.cell, width: "14.285714285714286%"}}><Text></Text></View>
        </View>
        <View style={styles.row}>
          <View style={{...styles.cell, width: "14.285714285714286%"}}><Text>4.</Text></View>
          <View style={{...styles.cell, width: "14.285714285714286%"}}><Text>Permanent (F)</Text></View>
          <View style={{...styles.cell, width: "14.285714285714286%"}}><Text></Text></View>
          <View style={{...styles.cell, width: "14.285714285714286%"}}><Text></Text></View>
          <View style={{...styles.cell, width: "14.285714285714286%"}}><Text></Text></View>
          <View style={{...styles.cell, width: "14.285714285714286%"}}><Text></Text></View>
          <View style={{...styles.cell, width: "14.285714285714286%"}}><Text></Text></View>
        </View>
        <View style={styles.row}>
          <View style={{...styles.cell, width: "14.285714285714286%"}}><Text>5.</Text></View>
          <View style={{...styles.cell, width: "14.285714285714286%"}}><Text>Other than  Permanent (G)</Text></View>
          <View style={{...styles.cell, width: "14.285714285714286%"}}><Text></Text></View>
          <View style={{...styles.cell, width: "14.285714285714286%"}}><Text></Text></View>
          <View style={{...styles.cell, width: "14.285714285714286%"}}><Text></Text></View>
          <View style={{...styles.cell, width: "14.285714285714286%"}}><Text></Text></View>
          <View style={{...styles.cell, width: "14.285714285714286%"}}><Text></Text></View>
        </View>
        <View style={styles.row}>
          <View style={{...styles.cell, width: "14.285714285714286%"}}><Text>6.</Text></View>
          <View style={{...styles.cell, width: "14.285714285714286%"}}><Text>Total workers  (F + G)</Text></View>
          <View style={{...styles.cell, width: "14.285714285714286%"}}><Text></Text></View>
          <View style={{...styles.cell, width: "14.285714285714286%"}}><Text></Text></View>
          <View style={{...styles.cell, width: "14.285714285714286%"}}><Text></Text></View>
          <View style={{...styles.cell, width: "14.285714285714286%"}}><Text></Text></View>
          <View style={{...styles.cell, width: "14.285714285714286%"}}><Text></Text></View>
        </View>
      </View>
      <Text style={styles.p}>B: Differently abled Employees and workers:</Text>
      <View style={styles.table}>
        <View style={styles.row}>
          <View style={{...styles.cell, width: "14.285714285714286%"}}><Text>S. No.</Text></View>
          <View style={{...styles.cell, width: "14.285714285714286%"}}><Text>Particulars</Text></View>
          <View style={{...styles.cell, width: "14.285714285714286%"}}><Text></Text></View>
          <View style={{...styles.cell, width: "14.285714285714286%"}}><Text></Text></View>
          <View style={{...styles.cell, width: "14.285714285714286%"}}><Text></Text></View>
          <View style={{...styles.cell, width: "14.285714285714286%"}}><Text></Text></View>
          <View style={{...styles.cell, width: "14.285714285714286%"}}><Text></Text></View>
        </View>
        <View style={styles.row}>
          <View style={{...styles.cell, width: "14.285714285714286%"}}><Text>S. No.</Text></View>
          <View style={{...styles.cell, width: "14.285714285714286%"}}><Text>Particulars</Text></View>
          <View style={{...styles.cell, width: "14.285714285714286%"}}><Text></Text></View>
          <View style={{...styles.cell, width: "14.285714285714286%"}}><Text></Text></View>
          <View style={{...styles.cell, width: "14.285714285714286%"}}><Text></Text></View>
          <View style={{...styles.cell, width: "14.285714285714286%"}}><Text></Text></View>
          <View style={{...styles.cell, width: "14.285714285714286%"}}><Text></Text></View>
        </View>
        <View style={styles.row}>
          <View style={{...styles.cell, width: "14.285714285714286%"}}><Text></Text></View>
          <View style={{...styles.cell, width: "14.285714285714286%"}}><Text></Text></View>
          <View style={{...styles.cell, width: "14.285714285714286%"}}><Text></Text></View>
          <View style={{...styles.cell, width: "14.285714285714286%"}}><Text></Text></View>
          <View style={{...styles.cell, width: "14.285714285714286%"}}><Text></Text></View>
          <View style={{...styles.cell, width: "14.285714285714286%"}}><Text></Text></View>
          <View style={{...styles.cell, width: "14.285714285714286%"}}><Text></Text></View>
        </View>
        <View style={styles.row}>
          <View style={{...styles.cell, width: "14.285714285714286%"}}><Text>1.</Text></View>
          <View style={{...styles.cell, width: "14.285714285714286%"}}><Text>Permanent (D)</Text></View>
          <View style={{...styles.cell, width: "14.285714285714286%"}}><Text></Text></View>
          <View style={{...styles.cell, width: "14.285714285714286%"}}><Text></Text></View>
          <View style={{...styles.cell, width: "14.285714285714286%"}}><Text></Text></View>
          <View style={{...styles.cell, width: "14.285714285714286%"}}><Text></Text></View>
          <View style={{...styles.cell, width: "14.285714285714286%"}}><Text></Text></View>
        </View>
        <View style={styles.row}>
          <View style={{...styles.cell, width: "14.285714285714286%"}}><Text>2.</Text></View>
          <View style={{...styles.cell, width: "14.285714285714286%"}}><Text>Other than Permanent (E)</Text></View>
          <View style={{...styles.cell, width: "14.285714285714286%"}}><Text></Text></View>
          <View style={{...styles.cell, width: "14.285714285714286%"}}><Text></Text></View>
          <View style={{...styles.cell, width: "14.285714285714286%"}}><Text></Text></View>
          <View style={{...styles.cell, width: "14.285714285714286%"}}><Text></Text></View>
          <View style={{...styles.cell, width: "14.285714285714286%"}}><Text></Text></View>
        </View>
        <View style={styles.row}>
          <View style={{...styles.cell, width: "14.285714285714286%"}}><Text>3.</Text></View>
          <View style={{...styles.cell, width: "14.285714285714286%"}}><Text>Total differently  abled employees   (D + E)</Text></View>
          <View style={{...styles.cell, width: "14.285714285714286%"}}><Text></Text></View>
          <View style={{...styles.cell, width: "14.285714285714286%"}}><Text></Text></View>
          <View style={{...styles.cell, width: "14.285714285714286%"}}><Text></Text></View>
          <View style={{...styles.cell, width: "14.285714285714286%"}}><Text></Text></View>
          <View style={{...styles.cell, width: "14.285714285714286%"}}><Text></Text></View>
        </View>
        <View style={styles.row}>
          <View style={{...styles.cell, width: "14.285714285714286%"}}><Text></Text></View>
          <View style={{...styles.cell, width: "14.285714285714286%"}}><Text></Text></View>
          <View style={{...styles.cell, width: "14.285714285714286%"}}><Text></Text></View>
          <View style={{...styles.cell, width: "14.285714285714286%"}}><Text></Text></View>
          <View style={{...styles.cell, width: "14.285714285714286%"}}><Text></Text></View>
          <View style={{...styles.cell, width: "14.285714285714286%"}}><Text></Text></View>
          <View style={{...styles.cell, width: "14.285714285714286%"}}><Text></Text></View>
        </View>
        <View style={styles.row}>
          <View style={{...styles.cell, width: "14.285714285714286%"}}><Text>4.</Text></View>
          <View style={{...styles.cell, width: "14.285714285714286%"}}><Text>Permanent (F)</Text></View>
          <View style={{...styles.cell, width: "14.285714285714286%"}}><Text></Text></View>
          <View style={{...styles.cell, width: "14.285714285714286%"}}><Text></Text></View>
          <View style={{...styles.cell, width: "14.285714285714286%"}}><Text></Text></View>
          <View style={{...styles.cell, width: "14.285714285714286%"}}><Text></Text></View>
          <View style={{...styles.cell, width: "14.285714285714286%"}}><Text></Text></View>
        </View>
        <View style={styles.row}>
          <View style={{...styles.cell, width: "14.285714285714286%"}}><Text>5.</Text></View>
          <View style={{...styles.cell, width: "14.285714285714286%"}}><Text>Other than Permanent (G)</Text></View>
          <View style={{...styles.cell, width: "14.285714285714286%"}}><Text></Text></View>
          <View style={{...styles.cell, width: "14.285714285714286%"}}><Text></Text></View>
          <View style={{...styles.cell, width: "14.285714285714286%"}}><Text></Text></View>
          <View style={{...styles.cell, width: "14.285714285714286%"}}><Text></Text></View>
          <View style={{...styles.cell, width: "14.285714285714286%"}}><Text></Text></View>
        </View>
        <View style={styles.row}>
          <View style={{...styles.cell, width: "14.285714285714286%"}}><Text>6.</Text></View>
          <View style={{...styles.cell, width: "14.285714285714286%"}}><Text>Total differently  abled employees   (F + G)</Text></View>
          <View style={{...styles.cell, width: "14.285714285714286%"}}><Text></Text></View>
          <View style={{...styles.cell, width: "14.285714285714286%"}}><Text></Text></View>
          <View style={{...styles.cell, width: "14.285714285714286%"}}><Text></Text></View>
          <View style={{...styles.cell, width: "14.285714285714286%"}}><Text></Text></View>
          <View style={{...styles.cell, width: "14.285714285714286%"}}><Text></Text></View>
        </View>
      </View>
      <Text style={styles.p}>C : Participation/Inclusion/Representation of Women</Text>
      <View style={styles.table}>
        <View style={styles.row}>
          <View style={{...styles.cell, width: "25.0%"}}><Text></Text></View>
          <View style={{...styles.cell, width: "25.0%"}}><Text>Total (A)</Text></View>
          <View style={{...styles.cell, width: "25.0%"}}><Text></Text></View>
          <View style={{...styles.cell, width: "25.0%"}}><Text></Text></View>
        </View>
        <View style={styles.row}>
          <View style={{...styles.cell, width: "25.0%"}}><Text></Text></View>
          <View style={{...styles.cell, width: "25.0%"}}><Text>Total (A)</Text></View>
          <View style={{...styles.cell, width: "25.0%"}}><Text></Text></View>
          <View style={{...styles.cell, width: "25.0%"}}><Text></Text></View>
        </View>
        <View style={styles.row}>
          <View style={{...styles.cell, width: "25.0%"}}><Text>Board of Directors</Text></View>
          <View style={{...styles.cell, width: "25.0%"}}><Text>5</Text></View>
          <View style={{...styles.cell, width: "25.0%"}}><Text></Text></View>
          <View style={{...styles.cell, width: "25.0%"}}><Text></Text></View>
        </View>
        <View style={styles.row}>
          <View style={{...styles.cell, width: "25.0%"}}><Text>Key Management  Personnel</Text></View>
          <View style={{...styles.cell, width: "25.0%"}}><Text>7</Text></View>
          <View style={{...styles.cell, width: "25.0%"}}><Text></Text></View>
          <View style={{...styles.cell, width: "25.0%"}}><Text></Text></View>
        </View>
      </View>
      <Text style={styles.p}>D : Turnover rate for permanent employees and workers</Text>
      <Text style={styles.p}>(Disclose trends for the past 3 years)</Text>
      <View style={styles.table}>
        <View style={styles.row}>
          <View style={{...styles.cell, width: "10.0%"}}><Text></Text></View>
          <View style={{...styles.cell, width: "10.0%"}}><Text></Text></View>
          <View style={{...styles.cell, width: "10.0%"}}><Text></Text></View>
          <View style={{...styles.cell, width: "10.0%"}}><Text></Text></View>
          <View style={{...styles.cell, width: "10.0%"}}><Text></Text></View>
          <View style={{...styles.cell, width: "10.0%"}}><Text></Text></View>
          <View style={{...styles.cell, width: "10.0%"}}><Text></Text></View>
          <View style={{...styles.cell, width: "10.0%"}}><Text></Text></View>
          <View style={{...styles.cell, width: "10.0%"}}><Text></Text></View>
          <View style={{...styles.cell, width: "10.0%"}}><Text></Text></View>
        </View>
        <View style={styles.row}>
          <View style={{...styles.cell, width: "10.0%"}}><Text></Text></View>
          <View style={{...styles.cell, width: "10.0%"}}><Text>Male</Text></View>
          <View style={{...styles.cell, width: "10.0%"}}><Text></Text></View>
          <View style={{...styles.cell, width: "10.0%"}}><Text></Text></View>
          <View style={{...styles.cell, width: "10.0%"}}><Text></Text></View>
          <View style={{...styles.cell, width: "10.0%"}}><Text></Text></View>
          <View style={{...styles.cell, width: "10.0%"}}><Text></Text></View>
          <View style={{...styles.cell, width: "10.0%"}}><Text></Text></View>
          <View style={{...styles.cell, width: "10.0%"}}><Text></Text></View>
          <View style={{...styles.cell, width: "10.0%"}}><Text></Text></View>
        </View>
        <View style={styles.row}>
          <View style={{...styles.cell, width: "10.0%"}}><Text>Permanent Employees</Text></View>
          <View style={{...styles.cell, width: "10.0%"}}><Text>14.72%</Text></View>
          <View style={{...styles.cell, width: "10.0%"}}><Text></Text></View>
          <View style={{...styles.cell, width: "10.0%"}}><Text></Text></View>
          <View style={{...styles.cell, width: "10.0%"}}><Text></Text></View>
          <View style={{...styles.cell, width: "10.0%"}}><Text></Text></View>
          <View style={{...styles.cell, width: "10.0%"}}><Text></Text></View>
          <View style={{...styles.cell, width: "10.0%"}}><Text></Text></View>
          <View style={{...styles.cell, width: "10.0%"}}><Text></Text></View>
          <View style={{...styles.cell, width: "10.0%"}}><Text></Text></View>
        </View>
        <View style={styles.row}>
          <View style={{...styles.cell, width: "10.0%"}}><Text>Permanent Workers</Text></View>
          <View style={{...styles.cell, width: "10.0%"}}><Text>10.39%</Text></View>
          <View style={{...styles.cell, width: "10.0%"}}><Text></Text></View>
          <View style={{...styles.cell, width: "10.0%"}}><Text></Text></View>
          <View style={{...styles.cell, width: "10.0%"}}><Text></Text></View>
          <View style={{...styles.cell, width: "10.0%"}}><Text></Text></View>
          <View style={{...styles.cell, width: "10.0%"}}><Text></Text></View>
          <View style={{...styles.cell, width: "10.0%"}}><Text></Text></View>
          <View style={{...styles.cell, width: "10.0%"}}><Text></Text></View>
          <View style={{...styles.cell, width: "10.0%"}}><Text></Text></View>
        </View>
      </View>
      <Text style={styles.p}>V : Holding, Subsidiary and Associate Companies</Text>
      <Text style={styles.p}>(Including joint ventures)</Text>
      <Text style={styles.p}>Names of holding / subsidiary / associate companies / joint ventures</Text>
      <View style={styles.table}>
        <View style={styles.row}>
          <View style={{...styles.cell, width: "20.0%"}}><Text>S. No.</Text></View>
          <View style={{...styles.cell, width: "20.0%"}}><Text>Name of the holding/ subsidiary/ associate companies/ joint ventures (A)</Text></View>
          <View style={{...styles.cell, width: "20.0%"}}><Text></Text></View>
          <View style={{...styles.cell, width: "20.0%"}}><Text></Text></View>
          <View style={{...styles.cell, width: "20.0%"}}><Text></Text></View>
        </View>
        <View style={styles.row}>
          <View style={{...styles.cell, width: "20.0%"}}><Text>1</Text></View>
          <View style={{...styles.cell, width: "20.0%"}}><Text>TCPL Precision Bearing Components (China) Co., Limited</Text></View>
          <View style={{...styles.cell, width: "20.0%"}}><Text></Text></View>
          <View style={{...styles.cell, width: "20.0%"}}><Text></Text></View>
          <View style={{...styles.cell, width: "20.0%"}}><Text></Text></View>
        </View>
        <View style={styles.row}>
          <View style={{...styles.cell, width: "20.0%"}}><Text>2</Text></View>
          <View style={{...styles.cell, width: "20.0%"}}><Text>Tata Consumer Products Europe SRL</Text></View>
          <View style={{...styles.cell, width: "20.0%"}}><Text></Text></View>
          <View style={{...styles.cell, width: "20.0%"}}><Text></Text></View>
          <View style={{...styles.cell, width: "20.0%"}}><Text></Text></View>
        </View>
        <View style={styles.row}>
          <View style={{...styles.cell, width: "20.0%"}}><Text>3</Text></View>
          <View style={{...styles.cell, width: "20.0%"}}><Text>Tata Consumer Products Advantek Limited</Text></View>
          <View style={{...styles.cell, width: "20.0%"}}><Text></Text></View>
          <View style={{...styles.cell, width: "20.0%"}}><Text></Text></View>
          <View style={{...styles.cell, width: "20.0%"}}><Text></Text></View>
        </View>
        <View style={styles.row}>
          <View style={{...styles.cell, width: "20.0%"}}><Text>4</Text></View>
          <View style={{...styles.cell, width: "20.0%"}}><Text>Cleanmax TCPL Solar LLP</Text></View>
          <View style={{...styles.cell, width: "20.0%"}}><Text></Text></View>
          <View style={{...styles.cell, width: "20.0%"}}><Text></Text></View>
          <View style={{...styles.cell, width: "20.0%"}}><Text></Text></View>
        </View>
      </View>
      <Text style={styles.p}>VI : CSR Details</Text>
      <Text style={styles.p}>Whether CSR is applicable as per section 135 of Companies Act, 2013: (Yes/No)</Text>
      <Text style={styles.p}>Turnover(in Rs.) :</Text>
      <Text style={styles.p}>Net worth (in Rs.) :</Text>
      <Text style={styles.p}>VII : Transparency and Disclosures Compliances</Text>
      <Text style={styles.p}>Complaints/Grievances on any of the principles (Principles 1 to 9) under the National Guidelines on Responsible Business Conduct:</Text>
      <View style={styles.table}>
        <View style={styles.row}>
          <View style={{...styles.cell, width: "12.5%"}}><Text>Stakeholder group from whom complaint is received</Text></View>
          <View style={{...styles.cell, width: "12.5%"}}><Text>Grievance Redressal Mechanism in Place  (Yes/No)  If yes, then provide web- link for grievance redress policy</Text></View>
          <View style={{...styles.cell, width: "12.5%"}}><Text></Text></View>
          <View style={{...styles.cell, width: "12.5%"}}><Text></Text></View>
          <View style={{...styles.cell, width: "12.5%"}}><Text></Text></View>
          <View style={{...styles.cell, width: "12.5%"}}><Text></Text></View>
          <View style={{...styles.cell, width: "12.5%"}}><Text></Text></View>
          <View style={{...styles.cell, width: "12.5%"}}><Text></Text></View>
        </View>
        <View style={styles.row}>
          <View style={{...styles.cell, width: "12.5%"}}><Text>Stakeholder group from whom complaint is received</Text></View>
          <View style={{...styles.cell, width: "12.5%"}}><Text>Grievance Redressal Mechanism in Place  (Yes/No)  If yes, then provide web- link for grievance redress policy</Text></View>
          <View style={{...styles.cell, width: "12.5%"}}><Text></Text></View>
          <View style={{...styles.cell, width: "12.5%"}}><Text></Text></View>
          <View style={{...styles.cell, width: "12.5%"}}><Text></Text></View>
          <View style={{...styles.cell, width: "12.5%"}}><Text></Text></View>
          <View style={{...styles.cell, width: "12.5%"}}><Text></Text></View>
          <View style={{...styles.cell, width: "12.5%"}}><Text></Text></View>
        </View>
        <View style={styles.row}>
          <View style={{...styles.cell, width: "12.5%"}}><Text>Communities</Text></View>
          <View style={{...styles.cell, width: "12.5%"}}><Text>Yes</Text></View>
          <View style={{...styles.cell, width: "12.5%"}}><Text></Text></View>
          <View style={{...styles.cell, width: "12.5%"}}><Text></Text></View>
          <View style={{...styles.cell, width: "12.5%"}}><Text></Text></View>
          <View style={{...styles.cell, width: "12.5%"}}><Text></Text></View>
          <View style={{...styles.cell, width: "12.5%"}}><Text></Text></View>
          <View style={{...styles.cell, width: "12.5%"}}><Text></Text></View>
        </View>
        <View style={styles.row}>
          <View style={{...styles.cell, width: "12.5%"}}><Text>Investors  (other than shareholders) *</Text></View>
          <View style={{...styles.cell, width: "12.5%"}}><Text>Yes, https://www.harshaengineers.com/InvestorRelations/company policiesphp</Text></View>
          <View style={{...styles.cell, width: "12.5%"}}><Text></Text></View>
          <View style={{...styles.cell, width: "12.5%"}}><Text></Text></View>
          <View style={{...styles.cell, width: "12.5%"}}><Text></Text></View>
          <View style={{...styles.cell, width: "12.5%"}}><Text></Text></View>
          <View style={{...styles.cell, width: "12.5%"}}><Text></Text></View>
          <View style={{...styles.cell, width: "12.5%"}}><Text></Text></View>
        </View>
        <View style={styles.row}>
          <View style={{...styles.cell, width: "12.5%"}}><Text>Shareholders*</Text></View>
          <View style={{...styles.cell, width: "12.5%"}}><Text>Yes https://www.harshaengineers.com/InvestorRelations/company policies.</Text></View>
          <View style={{...styles.cell, width: "12.5%"}}><Text></Text></View>
          <View style={{...styles.cell, width: "12.5%"}}><Text></Text></View>
          <View style={{...styles.cell, width: "12.5%"}}><Text></Text></View>
          <View style={{...styles.cell, width: "12.5%"}}><Text></Text></View>
          <View style={{...styles.cell, width: "12.5%"}}><Text></Text></View>
          <View style={{...styles.cell, width: "12.5%"}}><Text></Text></View>
        </View>
        <View style={styles.row}>
          <View style={{...styles.cell, width: "12.5%"}}><Text>Employees  and  workers</Text></View>
          <View style={{...styles.cell, width: "12.5%"}}><Text>Yes, HR representative available for every dept. HR SPOCs for every function.</Text></View>
          <View style={{...styles.cell, width: "12.5%"}}><Text></Text></View>
          <View style={{...styles.cell, width: "12.5%"}}><Text></Text></View>
          <View style={{...styles.cell, width: "12.5%"}}><Text></Text></View>
          <View style={{...styles.cell, width: "12.5%"}}><Text></Text></View>
          <View style={{...styles.cell, width: "12.5%"}}><Text></Text></View>
          <View style={{...styles.cell, width: "12.5%"}}><Text></Text></View>
        </View>
        <View style={styles.row}>
          <View style={{...styles.cell, width: "12.5%"}}><Text>Customers</Text></View>
          <View style={{...styles.cell, width: "12.5%"}}><Text>Yes</Text></View>
          <View style={{...styles.cell, width: "12.5%"}}><Text></Text></View>
          <View style={{...styles.cell, width: "12.5%"}}><Text></Text></View>
          <View style={{...styles.cell, width: "12.5%"}}><Text></Text></View>
          <View style={{...styles.cell, width: "12.5%"}}><Text></Text></View>
          <View style={{...styles.cell, width: "12.5%"}}><Text></Text></View>
          <View style={{...styles.cell, width: "12.5%"}}><Text></Text></View>
        </View>
        <View style={styles.row}>
          <View style={{...styles.cell, width: "12.5%"}}><Text>Value Chain  Partners</Text></View>
          <View style={{...styles.cell, width: "12.5%"}}><Text>Yes</Text></View>
          <View style={{...styles.cell, width: "12.5%"}}><Text></Text></View>
          <View style={{...styles.cell, width: "12.5%"}}><Text></Text></View>
          <View style={{...styles.cell, width: "12.5%"}}><Text></Text></View>
          <View style={{...styles.cell, width: "12.5%"}}><Text></Text></View>
          <View style={{...styles.cell, width: "12.5%"}}><Text></Text></View>
          <View style={{...styles.cell, width: "12.5%"}}><Text></Text></View>
        </View>
        <View style={styles.row}>
          <View style={{...styles.cell, width: "12.5%"}}><Text>Other (please  specify)</Text></View>
          <View style={{...styles.cell, width: "12.5%"}}><Text>NA</Text></View>
          <View style={{...styles.cell, width: "12.5%"}}><Text></Text></View>
          <View style={{...styles.cell, width: "12.5%"}}><Text></Text></View>
          <View style={{...styles.cell, width: "12.5%"}}><Text></Text></View>
          <View style={{...styles.cell, width: "12.5%"}}><Text></Text></View>
          <View style={{...styles.cell, width: "12.5%"}}><Text></Text></View>
          <View style={{...styles.cell, width: "12.5%"}}><Text></Text></View>
        </View>
      </View>
      <Text style={styles.p}>*The Company got listed on September 26, 2022. Most of the complaints mentioned as part of investor complaints are related to IPO (non-receipt of funds). Further, investor complaints also include shareholder complaints.</Text>
      <Text style={styles.p}>** PPM: Part per million</Text>
      <Text style={styles.p}>Overview of the entity’s material responsible business conduct issues</Text>
      <Text style={styles.p}>Please indicate material responsible business conduct and sustainability issues pertaining to environmental and social matters that present a risk or an opportunity to your business, rationale for identifying the same, approach to adapt or mitigate the risk along-with its financial implications, as per the following format</Text>
      <View style={styles.table}>
        <View style={styles.row}>
          <View style={{...styles.cell, width: "14.285714285714286%"}}><Text>S. No.</Text></View>
          <View style={{...styles.cell, width: "14.285714285714286%"}}><Text>Material</Text></View>
          <View style={{...styles.cell, width: "14.285714285714286%"}}><Text></Text></View>
          <View style={{...styles.cell, width: "14.285714285714286%"}}><Text></Text></View>
          <View style={{...styles.cell, width: "14.285714285714286%"}}><Text></Text></View>
          <View style={{...styles.cell, width: "14.285714285714286%"}}><Text></Text></View>
          <View style={{...styles.cell, width: "14.285714285714286%"}}><Text></Text></View>
        </View>
        <View style={styles.row}>
          <View style={{...styles.cell, width: "14.285714285714286%"}}><Text></Text></View>
          <View style={{...styles.cell, width: "14.285714285714286%"}}><Text>identified</Text></View>
          <View style={{...styles.cell, width: "14.285714285714286%"}}><Text></Text></View>
          <View style={{...styles.cell, width: "14.285714285714286%"}}><Text></Text></View>
          <View style={{...styles.cell, width: "14.285714285714286%"}}><Text></Text></View>
          <View style={{...styles.cell, width: "14.285714285714286%"}}><Text></Text></View>
          <View style={{...styles.cell, width: "14.285714285714286%"}}><Text></Text></View>
        </View>
        <View style={styles.row}>
          <View style={{...styles.cell, width: "14.285714285714286%"}}><Text></Text></View>
          <View style={{...styles.cell, width: "14.285714285714286%"}}><Text></Text></View>
          <View style={{...styles.cell, width: "14.285714285714286%"}}><Text></Text></View>
          <View style={{...styles.cell, width: "14.285714285714286%"}}><Text></Text></View>
          <View style={{...styles.cell, width: "14.285714285714286%"}}><Text></Text></View>
          <View style={{...styles.cell, width: "14.285714285714286%"}}><Text></Text></View>
          <View style={{...styles.cell, width: "14.285714285714286%"}}><Text></Text></View>
        </View>
        <View style={styles.row}>
          <View style={{...styles.cell, width: "14.285714285714286%"}}><Text></Text></View>
          <View style={{...styles.cell, width: "14.285714285714286%"}}><Text></Text></View>
          <View style={{...styles.cell, width: "14.285714285714286%"}}><Text></Text></View>
          <View style={{...styles.cell, width: "14.285714285714286%"}}><Text></Text></View>
          <View style={{...styles.cell, width: "14.285714285714286%"}}><Text></Text></View>
          <View style={{...styles.cell, width: "14.285714285714286%"}}><Text></Text></View>
          <View style={{...styles.cell, width: "14.285714285714286%"}}><Text></Text></View>
        </View>
        <View style={styles.row}>
          <View style={{...styles.cell, width: "14.285714285714286%"}}><Text></Text></View>
          <View style={{...styles.cell, width: "14.285714285714286%"}}><Text></Text></View>
          <View style={{...styles.cell, width: "14.285714285714286%"}}><Text></Text></View>
          <View style={{...styles.cell, width: "14.285714285714286%"}}><Text></Text></View>
          <View style={{...styles.cell, width: "14.285714285714286%"}}><Text></Text></View>
          <View style={{...styles.cell, width: "14.285714285714286%"}}><Text></Text></View>
          <View style={{...styles.cell, width: "14.285714285714286%"}}><Text></Text></View>
        </View>
        <View style={styles.row}>
          <View style={{...styles.cell, width: "14.285714285714286%"}}><Text></Text></View>
          <View style={{...styles.cell, width: "14.285714285714286%"}}><Text></Text></View>
          <View style={{...styles.cell, width: "14.285714285714286%"}}><Text></Text></View>
          <View style={{...styles.cell, width: "14.285714285714286%"}}><Text></Text></View>
          <View style={{...styles.cell, width: "14.285714285714286%"}}><Text></Text></View>
          <View style={{...styles.cell, width: "14.285714285714286%"}}><Text></Text></View>
          <View style={{...styles.cell, width: "14.285714285714286%"}}><Text></Text></View>
        </View>
        <View style={styles.row}>
          <View style={{...styles.cell, width: "14.285714285714286%"}}><Text></Text></View>
          <View style={{...styles.cell, width: "14.285714285714286%"}}><Text></Text></View>
          <View style={{...styles.cell, width: "14.285714285714286%"}}><Text></Text></View>
          <View style={{...styles.cell, width: "14.285714285714286%"}}><Text></Text></View>
          <View style={{...styles.cell, width: "14.285714285714286%"}}><Text></Text></View>
          <View style={{...styles.cell, width: "14.285714285714286%"}}><Text></Text></View>
          <View style={{...styles.cell, width: "14.285714285714286%"}}><Text></Text></View>
        </View>
        <View style={styles.row}>
          <View style={{...styles.cell, width: "14.285714285714286%"}}><Text></Text></View>
          <View style={{...styles.cell, width: "14.285714285714286%"}}><Text></Text></View>
          <View style={{...styles.cell, width: "14.285714285714286%"}}><Text></Text></View>
          <View style={{...styles.cell, width: "14.285714285714286%"}}><Text></Text></View>
          <View style={{...styles.cell, width: "14.285714285714286%"}}><Text></Text></View>
          <View style={{...styles.cell, width: "14.285714285714286%"}}><Text></Text></View>
          <View style={{...styles.cell, width: "14.285714285714286%"}}><Text></Text></View>
        </View>
        <View style={styles.row}>
          <View style={{...styles.cell, width: "14.285714285714286%"}}><Text></Text></View>
          <View style={{...styles.cell, width: "14.285714285714286%"}}><Text></Text></View>
          <View style={{...styles.cell, width: "14.285714285714286%"}}><Text></Text></View>
          <View style={{...styles.cell, width: "14.285714285714286%"}}><Text></Text></View>
          <View style={{...styles.cell, width: "14.285714285714286%"}}><Text></Text></View>
          <View style={{...styles.cell, width: "14.285714285714286%"}}><Text></Text></View>
          <View style={{...styles.cell, width: "14.285714285714286%"}}><Text></Text></View>
        </View>
        <View style={styles.row}>
          <View style={{...styles.cell, width: "14.285714285714286%"}}><Text></Text></View>
          <View style={{...styles.cell, width: "14.285714285714286%"}}><Text></Text></View>
          <View style={{...styles.cell, width: "14.285714285714286%"}}><Text></Text></View>
          <View style={{...styles.cell, width: "14.285714285714286%"}}><Text></Text></View>
          <View style={{...styles.cell, width: "14.285714285714286%"}}><Text></Text></View>
          <View style={{...styles.cell, width: "14.285714285714286%"}}><Text></Text></View>
          <View style={{...styles.cell, width: "14.285714285714286%"}}><Text></Text></View>
        </View>
        <View style={styles.row}>
          <View style={{...styles.cell, width: "14.285714285714286%"}}><Text></Text></View>
          <View style={{...styles.cell, width: "14.285714285714286%"}}><Text></Text></View>
          <View style={{...styles.cell, width: "14.285714285714286%"}}><Text></Text></View>
          <View style={{...styles.cell, width: "14.285714285714286%"}}><Text></Text></View>
          <View style={{...styles.cell, width: "14.285714285714286%"}}><Text></Text></View>
          <View style={{...styles.cell, width: "14.285714285714286%"}}><Text></Text></View>
          <View style={{...styles.cell, width: "14.285714285714286%"}}><Text></Text></View>
        </View>
      </View>
      <Text style={styles.p}>Section B: Management and Process Disclosures</Text>
      <Text style={styles.p}>This section is aimed at helping businesses demonstrate the structures, policies and processes put in place towards adopting the NGRBC Principles and Core Elements.</Text>
      <View style={styles.table}>
        <View style={styles.row}>
          <View style={{...styles.cell, width: "10.0%"}}><Text>Disclosure Questions</Text></View>
          <View style={{...styles.cell, width: "10.0%"}}><Text>P1</Text></View>
          <View style={{...styles.cell, width: "10.0%"}}><Text></Text></View>
          <View style={{...styles.cell, width: "10.0%"}}><Text></Text></View>
          <View style={{...styles.cell, width: "10.0%"}}><Text></Text></View>
          <View style={{...styles.cell, width: "10.0%"}}><Text></Text></View>
          <View style={{...styles.cell, width: "10.0%"}}><Text></Text></View>
          <View style={{...styles.cell, width: "10.0%"}}><Text></Text></View>
          <View style={{...styles.cell, width: "10.0%"}}><Text></Text></View>
          <View style={{...styles.cell, width: "10.0%"}}><Text></Text></View>
        </View>
        <View style={styles.row}>
          <View style={{...styles.cell, width: "10.0%"}}><Text></Text></View>
          <View style={{...styles.cell, width: "10.0%"}}><Text></Text></View>
          <View style={{...styles.cell, width: "10.0%"}}><Text></Text></View>
          <View style={{...styles.cell, width: "10.0%"}}><Text></Text></View>
          <View style={{...styles.cell, width: "10.0%"}}><Text></Text></View>
          <View style={{...styles.cell, width: "10.0%"}}><Text></Text></View>
          <View style={{...styles.cell, width: "10.0%"}}><Text></Text></View>
          <View style={{...styles.cell, width: "10.0%"}}><Text></Text></View>
          <View style={{...styles.cell, width: "10.0%"}}><Text></Text></View>
          <View style={{...styles.cell, width: "10.0%"}}><Text></Text></View>
        </View>
        <View style={styles.row}>
          <View style={{...styles.cell, width: "10.0%"}}><Text>1. a. Whether your entity’s policy/policies cover each principle and its core elements of the NGRBCs. (Yes/No)</Text></View>
          <View style={{...styles.cell, width: "10.0%"}}><Text>Yes</Text></View>
          <View style={{...styles.cell, width: "10.0%"}}><Text></Text></View>
          <View style={{...styles.cell, width: "10.0%"}}><Text></Text></View>
          <View style={{...styles.cell, width: "10.0%"}}><Text></Text></View>
          <View style={{...styles.cell, width: "10.0%"}}><Text></Text></View>
          <View style={{...styles.cell, width: "10.0%"}}><Text></Text></View>
          <View style={{...styles.cell, width: "10.0%"}}><Text></Text></View>
          <View style={{...styles.cell, width: "10.0%"}}><Text></Text></View>
          <View style={{...styles.cell, width: "10.0%"}}><Text></Text></View>
        </View>
        <View style={styles.row}>
          <View style={{...styles.cell, width: "10.0%"}}><Text>b. Has the policy been approved by the Board? (Yes/No)</Text></View>
          <View style={{...styles.cell, width: "10.0%"}}><Text>Yes</Text></View>
          <View style={{...styles.cell, width: "10.0%"}}><Text></Text></View>
          <View style={{...styles.cell, width: "10.0%"}}><Text></Text></View>
          <View style={{...styles.cell, width: "10.0%"}}><Text></Text></View>
          <View style={{...styles.cell, width: "10.0%"}}><Text></Text></View>
          <View style={{...styles.cell, width: "10.0%"}}><Text></Text></View>
          <View style={{...styles.cell, width: "10.0%"}}><Text></Text></View>
          <View style={{...styles.cell, width: "10.0%"}}><Text></Text></View>
          <View style={{...styles.cell, width: "10.0%"}}><Text></Text></View>
        </View>
        <View style={styles.row}>
          <View style={{...styles.cell, width: "10.0%"}}><Text>c. Web Link of the Policies, if available</Text></View>
          <View style={{...styles.cell, width: "10.0%"}}><Text></Text></View>
          <View style={{...styles.cell, width: "10.0%"}}><Text></Text></View>
          <View style={{...styles.cell, width: "10.0%"}}><Text></Text></View>
          <View style={{...styles.cell, width: "10.0%"}}><Text></Text></View>
          <View style={{...styles.cell, width: "10.0%"}}><Text></Text></View>
          <View style={{...styles.cell, width: "10.0%"}}><Text></Text></View>
          <View style={{...styles.cell, width: "10.0%"}}><Text></Text></View>
          <View style={{...styles.cell, width: "10.0%"}}><Text></Text></View>
          <View style={{...styles.cell, width: "10.0%"}}><Text></Text></View>
        </View>
        <View style={styles.row}>
          <View style={{...styles.cell, width: "10.0%"}}><Text>2. Whether the entity has translated the policy into procedures. (Yes / No)</Text></View>
          <View style={{...styles.cell, width: "10.0%"}}><Text>Yes</Text></View>
          <View style={{...styles.cell, width: "10.0%"}}><Text></Text></View>
          <View style={{...styles.cell, width: "10.0%"}}><Text></Text></View>
          <View style={{...styles.cell, width: "10.0%"}}><Text></Text></View>
          <View style={{...styles.cell, width: "10.0%"}}><Text></Text></View>
          <View style={{...styles.cell, width: "10.0%"}}><Text></Text></View>
          <View style={{...styles.cell, width: "10.0%"}}><Text></Text></View>
          <View style={{...styles.cell, width: "10.0%"}}><Text></Text></View>
          <View style={{...styles.cell, width: "10.0%"}}><Text></Text></View>
        </View>
        <View style={styles.row}>
          <View style={{...styles.cell, width: "10.0%"}}><Text>3. Do the enlisted policies extend to your value chain partners? (Yes/No)</Text></View>
          <View style={{...styles.cell, width: "10.0%"}}><Text>Yes</Text></View>
          <View style={{...styles.cell, width: "10.0%"}}><Text></Text></View>
          <View style={{...styles.cell, width: "10.0%"}}><Text></Text></View>
          <View style={{...styles.cell, width: "10.0%"}}><Text></Text></View>
          <View style={{...styles.cell, width: "10.0%"}}><Text></Text></View>
          <View style={{...styles.cell, width: "10.0%"}}><Text></Text></View>
          <View style={{...styles.cell, width: "10.0%"}}><Text></Text></View>
          <View style={{...styles.cell, width: "10.0%"}}><Text></Text></View>
          <View style={{...styles.cell, width: "10.0%"}}><Text></Text></View>
        </View>
        <View style={styles.row}>
          <View style={{...styles.cell, width: "10.0%"}}><Text>4. Name of the national and international codes/certifications/labels/ standards (e.g. Forest Stewardship Council, Fairtrade, Rainforest Alliance, Trustea) standards (e.g. SA 8000, OHSAS, ISO, BIS) adopted by your entity and mapped to each principle.</Text></View>
          <View style={{...styles.cell, width: "10.0%"}}><Text></Text></View>
          <View style={{...styles.cell, width: "10.0%"}}><Text></Text></View>
          <View style={{...styles.cell, width: "10.0%"}}><Text></Text></View>
          <View style={{...styles.cell, width: "10.0%"}}><Text></Text></View>
          <View style={{...styles.cell, width: "10.0%"}}><Text></Text></View>
          <View style={{...styles.cell, width: "10.0%"}}><Text></Text></View>
          <View style={{...styles.cell, width: "10.0%"}}><Text></Text></View>
          <View style={{...styles.cell, width: "10.0%"}}><Text></Text></View>
          <View style={{...styles.cell, width: "10.0%"}}><Text></Text></View>
        </View>
        <View style={styles.row}>
          <View style={{...styles.cell, width: "10.0%"}}><Text>5.	Specific commitments, goals and targets set by the entity with defined timelines, if any.</Text></View>
          <View style={{...styles.cell, width: "10.0%"}}><Text></Text></View>
          <View style={{...styles.cell, width: "10.0%"}}><Text></Text></View>
          <View style={{...styles.cell, width: "10.0%"}}><Text></Text></View>
          <View style={{...styles.cell, width: "10.0%"}}><Text></Text></View>
          <View style={{...styles.cell, width: "10.0%"}}><Text></Text></View>
          <View style={{...styles.cell, width: "10.0%"}}><Text></Text></View>
          <View style={{...styles.cell, width: "10.0%"}}><Text></Text></View>
          <View style={{...styles.cell, width: "10.0%"}}><Text></Text></View>
          <View style={{...styles.cell, width: "10.0%"}}><Text></Text></View>
        </View>
        <View style={styles.row}>
          <View style={{...styles.cell, width: "10.0%"}}><Text>6.  Performance of the entity against the specific commitments, goals and targets along-with reasons in case the same are not met.</Text></View>
          <View style={{...styles.cell, width: "10.0%"}}><Text></Text></View>
          <View style={{...styles.cell, width: "10.0%"}}><Text></Text></View>
          <View style={{...styles.cell, width: "10.0%"}}><Text></Text></View>
          <View style={{...styles.cell, width: "10.0%"}}><Text></Text></View>
          <View style={{...styles.cell, width: "10.0%"}}><Text></Text></View>
          <View style={{...styles.cell, width: "10.0%"}}><Text></Text></View>
          <View style={{...styles.cell, width: "10.0%"}}><Text></Text></View>
          <View style={{...styles.cell, width: "10.0%"}}><Text></Text></View>
          <View style={{...styles.cell, width: "10.0%"}}><Text></Text></View>
        </View>
        <View style={styles.row}>
          <View style={{...styles.cell, width: "10.0%"}}><Text></Text></View>
          <View style={{...styles.cell, width: "10.0%"}}><Text></Text></View>
          <View style={{...styles.cell, width: "10.0%"}}><Text></Text></View>
          <View style={{...styles.cell, width: "10.0%"}}><Text></Text></View>
          <View style={{...styles.cell, width: "10.0%"}}><Text></Text></View>
          <View style={{...styles.cell, width: "10.0%"}}><Text></Text></View>
          <View style={{...styles.cell, width: "10.0%"}}><Text></Text></View>
          <View style={{...styles.cell, width: "10.0%"}}><Text></Text></View>
          <View style={{...styles.cell, width: "10.0%"}}><Text></Text></View>
          <View style={{...styles.cell, width: "10.0%"}}><Text></Text></View>
        </View>
        <View style={styles.row}>
          <View style={{...styles.cell, width: "10.0%"}}><Text></Text></View>
          <View style={{...styles.cell, width: "10.0%"}}><Text></Text></View>
          <View style={{...styles.cell, width: "10.0%"}}><Text></Text></View>
          <View style={{...styles.cell, width: "10.0%"}}><Text></Text></View>
          <View style={{...styles.cell, width: "10.0%"}}><Text></Text></View>
          <View style={{...styles.cell, width: "10.0%"}}><Text></Text></View>
          <View style={{...styles.cell, width: "10.0%"}}><Text></Text></View>
          <View style={{...styles.cell, width: "10.0%"}}><Text></Text></View>
          <View style={{...styles.cell, width: "10.0%"}}><Text></Text></View>
          <View style={{...styles.cell, width: "10.0%"}}><Text></Text></View>
        </View>
        <View style={styles.row}>
          <View style={{...styles.cell, width: "10.0%"}}><Text>8. Details of the highest authority responsible for implementation and oversight of the Business          Responsibility policy (ies).</Text></View>
          <View style={{...styles.cell, width: "10.0%"}}><Text></Text></View>
          <View style={{...styles.cell, width: "10.0%"}}><Text></Text></View>
          <View style={{...styles.cell, width: "10.0%"}}><Text></Text></View>
          <View style={{...styles.cell, width: "10.0%"}}><Text></Text></View>
          <View style={{...styles.cell, width: "10.0%"}}><Text></Text></View>
          <View style={{...styles.cell, width: "10.0%"}}><Text></Text></View>
          <View style={{...styles.cell, width: "10.0%"}}><Text></Text></View>
          <View style={{...styles.cell, width: "10.0%"}}><Text></Text></View>
          <View style={{...styles.cell, width: "10.0%"}}><Text></Text></View>
        </View>
        <View style={styles.row}>
          <View style={{...styles.cell, width: "10.0%"}}><Text>9. Does the entity have a specified Committee of the Board/ Director responsible for decision making on sustainability related issues        (Yes / No). If yes, provide details.</Text></View>
          <View style={{...styles.cell, width: "10.0%"}}><Text></Text></View>
          <View style={{...styles.cell, width: "10.0%"}}><Text></Text></View>
          <View style={{...styles.cell, width: "10.0%"}}><Text></Text></View>
          <View style={{...styles.cell, width: "10.0%"}}><Text></Text></View>
          <View style={{...styles.cell, width: "10.0%"}}><Text></Text></View>
          <View style={{...styles.cell, width: "10.0%"}}><Text></Text></View>
          <View style={{...styles.cell, width: "10.0%"}}><Text></Text></View>
          <View style={{...styles.cell, width: "10.0%"}}><Text></Text></View>
          <View style={{...styles.cell, width: "10.0%"}}><Text></Text></View>
        </View>
      </View>
      <Text style={styles.p}>10. Details of Review of NGRBCs by the Company:</Text>
      <View style={styles.table}>
        <View style={styles.row}>
          <View style={{...styles.cell, width: "5.2631578947368425%"}}><Text>Subject for Review</Text></View>
          <View style={{...styles.cell, width: "5.2631578947368425%"}}><Text></Text></View>
          <View style={{...styles.cell, width: "5.2631578947368425%"}}><Text></Text></View>
          <View style={{...styles.cell, width: "5.2631578947368425%"}}><Text></Text></View>
          <View style={{...styles.cell, width: "5.2631578947368425%"}}><Text></Text></View>
          <View style={{...styles.cell, width: "5.2631578947368425%"}}><Text></Text></View>
          <View style={{...styles.cell, width: "5.2631578947368425%"}}><Text></Text></View>
          <View style={{...styles.cell, width: "5.2631578947368425%"}}><Text></Text></View>
          <View style={{...styles.cell, width: "5.2631578947368425%"}}><Text></Text></View>
          <View style={{...styles.cell, width: "5.2631578947368425%"}}><Text></Text></View>
          <View style={{...styles.cell, width: "5.2631578947368425%"}}><Text></Text></View>
          <View style={{...styles.cell, width: "5.2631578947368425%"}}><Text></Text></View>
          <View style={{...styles.cell, width: "5.2631578947368425%"}}><Text></Text></View>
          <View style={{...styles.cell, width: "5.2631578947368425%"}}><Text></Text></View>
          <View style={{...styles.cell, width: "5.2631578947368425%"}}><Text></Text></View>
          <View style={{...styles.cell, width: "5.2631578947368425%"}}><Text></Text></View>
          <View style={{...styles.cell, width: "5.2631578947368425%"}}><Text></Text></View>
          <View style={{...styles.cell, width: "5.2631578947368425%"}}><Text></Text></View>
          <View style={{...styles.cell, width: "5.2631578947368425%"}}><Text></Text></View>
        </View>
        <View style={styles.row}>
          <View style={{...styles.cell, width: "5.2631578947368425%"}}><Text></Text></View>
          <View style={{...styles.cell, width: "5.2631578947368425%"}}><Text>P1</Text></View>
          <View style={{...styles.cell, width: "5.2631578947368425%"}}><Text></Text></View>
          <View style={{...styles.cell, width: "5.2631578947368425%"}}><Text></Text></View>
          <View style={{...styles.cell, width: "5.2631578947368425%"}}><Text></Text></View>
          <View style={{...styles.cell, width: "5.2631578947368425%"}}><Text></Text></View>
          <View style={{...styles.cell, width: "5.2631578947368425%"}}><Text></Text></View>
          <View style={{...styles.cell, width: "5.2631578947368425%"}}><Text></Text></View>
          <View style={{...styles.cell, width: "5.2631578947368425%"}}><Text></Text></View>
          <View style={{...styles.cell, width: "5.2631578947368425%"}}><Text></Text></View>
          <View style={{...styles.cell, width: "5.2631578947368425%"}}><Text></Text></View>
          <View style={{...styles.cell, width: "5.2631578947368425%"}}><Text></Text></View>
          <View style={{...styles.cell, width: "5.2631578947368425%"}}><Text></Text></View>
          <View style={{...styles.cell, width: "5.2631578947368425%"}}><Text></Text></View>
          <View style={{...styles.cell, width: "5.2631578947368425%"}}><Text></Text></View>
          <View style={{...styles.cell, width: "5.2631578947368425%"}}><Text></Text></View>
          <View style={{...styles.cell, width: "5.2631578947368425%"}}><Text></Text></View>
          <View style={{...styles.cell, width: "5.2631578947368425%"}}><Text></Text></View>
          <View style={{...styles.cell, width: "5.2631578947368425%"}}><Text></Text></View>
        </View>
        <View style={styles.row}>
          <View style={{...styles.cell, width: "5.2631578947368425%"}}><Text>Performance agains t above policies and follow up action</Text></View>
          <View style={{...styles.cell, width: "5.2631578947368425%"}}><Text></Text></View>
          <View style={{...styles.cell, width: "5.2631578947368425%"}}><Text></Text></View>
          <View style={{...styles.cell, width: "5.2631578947368425%"}}><Text></Text></View>
          <View style={{...styles.cell, width: "5.2631578947368425%"}}><Text></Text></View>
          <View style={{...styles.cell, width: "5.2631578947368425%"}}><Text></Text></View>
          <View style={{...styles.cell, width: "5.2631578947368425%"}}><Text></Text></View>
          <View style={{...styles.cell, width: "5.2631578947368425%"}}><Text></Text></View>
          <View style={{...styles.cell, width: "5.2631578947368425%"}}><Text></Text></View>
          <View style={{...styles.cell, width: "5.2631578947368425%"}}><Text></Text></View>
          <View style={{...styles.cell, width: "5.2631578947368425%"}}><Text></Text></View>
          <View style={{...styles.cell, width: "5.2631578947368425%"}}><Text></Text></View>
          <View style={{...styles.cell, width: "5.2631578947368425%"}}><Text></Text></View>
          <View style={{...styles.cell, width: "5.2631578947368425%"}}><Text></Text></View>
          <View style={{...styles.cell, width: "5.2631578947368425%"}}><Text></Text></View>
          <View style={{...styles.cell, width: "5.2631578947368425%"}}><Text></Text></View>
          <View style={{...styles.cell, width: "5.2631578947368425%"}}><Text></Text></View>
          <View style={{...styles.cell, width: "5.2631578947368425%"}}><Text></Text></View>
          <View style={{...styles.cell, width: "5.2631578947368425%"}}><Text></Text></View>
        </View>
        <View style={styles.row}>
          <View style={{...styles.cell, width: "5.2631578947368425%"}}><Text>Compliance with statutory requirements of relevance to the principles, an d, rectification of any non-compliances</Text></View>
          <View style={{...styles.cell, width: "5.2631578947368425%"}}><Text></Text></View>
          <View style={{...styles.cell, width: "5.2631578947368425%"}}><Text></Text></View>
          <View style={{...styles.cell, width: "5.2631578947368425%"}}><Text></Text></View>
          <View style={{...styles.cell, width: "5.2631578947368425%"}}><Text></Text></View>
          <View style={{...styles.cell, width: "5.2631578947368425%"}}><Text></Text></View>
          <View style={{...styles.cell, width: "5.2631578947368425%"}}><Text></Text></View>
          <View style={{...styles.cell, width: "5.2631578947368425%"}}><Text></Text></View>
          <View style={{...styles.cell, width: "5.2631578947368425%"}}><Text></Text></View>
          <View style={{...styles.cell, width: "5.2631578947368425%"}}><Text></Text></View>
          <View style={{...styles.cell, width: "5.2631578947368425%"}}><Text></Text></View>
          <View style={{...styles.cell, width: "5.2631578947368425%"}}><Text></Text></View>
          <View style={{...styles.cell, width: "5.2631578947368425%"}}><Text></Text></View>
          <View style={{...styles.cell, width: "5.2631578947368425%"}}><Text></Text></View>
          <View style={{...styles.cell, width: "5.2631578947368425%"}}><Text></Text></View>
          <View style={{...styles.cell, width: "5.2631578947368425%"}}><Text></Text></View>
          <View style={{...styles.cell, width: "5.2631578947368425%"}}><Text></Text></View>
          <View style={{...styles.cell, width: "5.2631578947368425%"}}><Text></Text></View>
          <View style={{...styles.cell, width: "5.2631578947368425%"}}><Text></Text></View>
        </View>
      </View>
      <Text style={styles.p}>11. Has the entity carried out independent assessment/ evaluation of the working of its policies by an external agency? (Yes/No). If yes, provide name of the agency.</Text>
      <View style={styles.table}>
        <View style={styles.row}>
          <View style={{...styles.cell, width: "11.11111111111111%"}}><Text>P1</Text></View>
          <View style={{...styles.cell, width: "11.11111111111111%"}}><Text>P2</Text></View>
          <View style={{...styles.cell, width: "11.11111111111111%"}}><Text></Text></View>
          <View style={{...styles.cell, width: "11.11111111111111%"}}><Text></Text></View>
          <View style={{...styles.cell, width: "11.11111111111111%"}}><Text></Text></View>
          <View style={{...styles.cell, width: "11.11111111111111%"}}><Text></Text></View>
          <View style={{...styles.cell, width: "11.11111111111111%"}}><Text></Text></View>
          <View style={{...styles.cell, width: "11.11111111111111%"}}><Text></Text></View>
          <View style={{...styles.cell, width: "11.11111111111111%"}}><Text></Text></View>
        </View>
        <View style={styles.row}>
          <View style={{...styles.cell, width: "11.11111111111111%"}}><Text></Text></View>
          <View style={{...styles.cell, width: "11.11111111111111%"}}><Text></Text></View>
          <View style={{...styles.cell, width: "11.11111111111111%"}}><Text></Text></View>
          <View style={{...styles.cell, width: "11.11111111111111%"}}><Text></Text></View>
          <View style={{...styles.cell, width: "11.11111111111111%"}}><Text></Text></View>
          <View style={{...styles.cell, width: "11.11111111111111%"}}><Text></Text></View>
          <View style={{...styles.cell, width: "11.11111111111111%"}}><Text></Text></View>
          <View style={{...styles.cell, width: "11.11111111111111%"}}><Text></Text></View>
          <View style={{...styles.cell, width: "11.11111111111111%"}}><Text></Text></View>
        </View>
      </View>
      <Text style={styles.p}>12. If answer to question (1) above is “No” i.e. not all Principles are covered by a policy, reasons to be stated:</Text>
      <View style={styles.table}>
        <View style={styles.row}>
          <View style={{...styles.cell, width: "10.0%"}}><Text>Questions</Text></View>
          <View style={{...styles.cell, width: "10.0%"}}><Text>P 1</Text></View>
          <View style={{...styles.cell, width: "10.0%"}}><Text></Text></View>
          <View style={{...styles.cell, width: "10.0%"}}><Text></Text></View>
          <View style={{...styles.cell, width: "10.0%"}}><Text></Text></View>
          <View style={{...styles.cell, width: "10.0%"}}><Text></Text></View>
          <View style={{...styles.cell, width: "10.0%"}}><Text></Text></View>
          <View style={{...styles.cell, width: "10.0%"}}><Text></Text></View>
          <View style={{...styles.cell, width: "10.0%"}}><Text></Text></View>
          <View style={{...styles.cell, width: "10.0%"}}><Text></Text></View>
        </View>
        <View style={styles.row}>
          <View style={{...styles.cell, width: "10.0%"}}><Text>The entity does not consider the Principles material to its business (Yes/No)</Text></View>
          <View style={{...styles.cell, width: "10.0%"}}><Text></Text></View>
          <View style={{...styles.cell, width: "10.0%"}}><Text></Text></View>
          <View style={{...styles.cell, width: "10.0%"}}><Text></Text></View>
          <View style={{...styles.cell, width: "10.0%"}}><Text></Text></View>
          <View style={{...styles.cell, width: "10.0%"}}><Text></Text></View>
          <View style={{...styles.cell, width: "10.0%"}}><Text></Text></View>
          <View style={{...styles.cell, width: "10.0%"}}><Text></Text></View>
          <View style={{...styles.cell, width: "10.0%"}}><Text></Text></View>
          <View style={{...styles.cell, width: "10.0%"}}><Text></Text></View>
        </View>
        <View style={styles.row}>
          <View style={{...styles.cell, width: "10.0%"}}><Text>The entity is not at a stage where it is in a position to formulate and implement the policies on specified principles (Yes/No)</Text></View>
          <View style={{...styles.cell, width: "10.0%"}}><Text></Text></View>
          <View style={{...styles.cell, width: "10.0%"}}><Text></Text></View>
          <View style={{...styles.cell, width: "10.0%"}}><Text></Text></View>
          <View style={{...styles.cell, width: "10.0%"}}><Text></Text></View>
          <View style={{...styles.cell, width: "10.0%"}}><Text></Text></View>
          <View style={{...styles.cell, width: "10.0%"}}><Text></Text></View>
          <View style={{...styles.cell, width: "10.0%"}}><Text></Text></View>
          <View style={{...styles.cell, width: "10.0%"}}><Text></Text></View>
          <View style={{...styles.cell, width: "10.0%"}}><Text></Text></View>
        </View>
        <View style={styles.row}>
          <View style={{...styles.cell, width: "10.0%"}}><Text>The entity does not have the financial or/human and technical resources available for the task (Yes/No)</Text></View>
          <View style={{...styles.cell, width: "10.0%"}}><Text></Text></View>
          <View style={{...styles.cell, width: "10.0%"}}><Text></Text></View>
          <View style={{...styles.cell, width: "10.0%"}}><Text></Text></View>
          <View style={{...styles.cell, width: "10.0%"}}><Text></Text></View>
          <View style={{...styles.cell, width: "10.0%"}}><Text></Text></View>
          <View style={{...styles.cell, width: "10.0%"}}><Text></Text></View>
          <View style={{...styles.cell, width: "10.0%"}}><Text></Text></View>
          <View style={{...styles.cell, width: "10.0%"}}><Text></Text></View>
          <View style={{...styles.cell, width: "10.0%"}}><Text></Text></View>
        </View>
        <View style={styles.row}>
          <View style={{...styles.cell, width: "10.0%"}}><Text>It is planned to be done in the next financial year (Yes/No)</Text></View>
          <View style={{...styles.cell, width: "10.0%"}}><Text></Text></View>
          <View style={{...styles.cell, width: "10.0%"}}><Text></Text></View>
          <View style={{...styles.cell, width: "10.0%"}}><Text></Text></View>
          <View style={{...styles.cell, width: "10.0%"}}><Text></Text></View>
          <View style={{...styles.cell, width: "10.0%"}}><Text></Text></View>
          <View style={{...styles.cell, width: "10.0%"}}><Text></Text></View>
          <View style={{...styles.cell, width: "10.0%"}}><Text></Text></View>
          <View style={{...styles.cell, width: "10.0%"}}><Text></Text></View>
          <View style={{...styles.cell, width: "10.0%"}}><Text></Text></View>
        </View>
        <View style={styles.row}>
          <View style={{...styles.cell, width: "10.0%"}}><Text>Any other reason (please specify)</Text></View>
          <View style={{...styles.cell, width: "10.0%"}}><Text></Text></View>
          <View style={{...styles.cell, width: "10.0%"}}><Text></Text></View>
          <View style={{...styles.cell, width: "10.0%"}}><Text></Text></View>
          <View style={{...styles.cell, width: "10.0%"}}><Text></Text></View>
          <View style={{...styles.cell, width: "10.0%"}}><Text></Text></View>
          <View style={{...styles.cell, width: "10.0%"}}><Text></Text></View>
          <View style={{...styles.cell, width: "10.0%"}}><Text></Text></View>
          <View style={{...styles.cell, width: "10.0%"}}><Text></Text></View>
          <View style={{...styles.cell, width: "10.0%"}}><Text></Text></View>
        </View>
      </View>
      <Text style={styles.p}>Section C: Principle Wise Performance Disclosure</Text>
      <Text style={styles.p}>This section is aimed at helping entities demonstrate their performance in integrating the Principles and Core Elements with key processes and decisions. The information sought is categorized as “Essential” and “Leadership”. While the essential indicators are expected to be disclosed by every entity that is mandated to file this report, the leadership indicators may be voluntarily disclosed by entities which aspire to progress to a higher level in their quest to be socially, environmentally and ethically responsible.</Text>
      <Text style={styles.p}>1. Percentage coverage by training and awareness programmes on any of the Principles during the financial year:</Text>
      <View style={styles.table}>
        <View style={styles.row}>
          <View style={{...styles.cell, width: "25.0%"}}><Text></Text></View>
          <View style={{...styles.cell, width: "25.0%"}}><Text></Text></View>
          <View style={{...styles.cell, width: "25.0%"}}><Text></Text></View>
          <View style={{...styles.cell, width: "25.0%"}}><Text></Text></View>
        </View>
        <View style={styles.row}>
          <View style={{...styles.cell, width: "25.0%"}}><Text>Segment</Text></View>
          <View style={{...styles.cell, width: "25.0%"}}><Text>Total number of training and awareness programmes held</Text></View>
          <View style={{...styles.cell, width: "25.0%"}}><Text></Text></View>
          <View style={{...styles.cell, width: "25.0%"}}><Text></Text></View>
        </View>
        <View style={styles.row}>
          <View style={{...styles.cell, width: "25.0%"}}><Text>Board of Directors</Text></View>
          <View style={{...styles.cell, width: "25.0%"}}><Text></Text></View>
          <View style={{...styles.cell, width: "25.0%"}}><Text></Text></View>
          <View style={{...styles.cell, width: "25.0%"}}><Text></Text></View>
        </View>
        <View style={styles.row}>
          <View style={{...styles.cell, width: "25.0%"}}><Text>Key Managerial Personnel</Text></View>
          <View style={{...styles.cell, width: "25.0%"}}><Text></Text></View>
          <View style={{...styles.cell, width: "25.0%"}}><Text></Text></View>
          <View style={{...styles.cell, width: "25.0%"}}><Text></Text></View>
        </View>
        <View style={styles.row}>
          <View style={{...styles.cell, width: "25.0%"}}><Text>Employees other than BoD and KMPs Workers</Text></View>
          <View style={{...styles.cell, width: "25.0%"}}><Text></Text></View>
          <View style={{...styles.cell, width: "25.0%"}}><Text></Text></View>
          <View style={{...styles.cell, width: "25.0%"}}><Text></Text></View>
        </View>
        <View style={styles.row}>
          <View style={{...styles.cell, width: "25.0%"}}><Text>Workers</Text></View>
          <View style={{...styles.cell, width: "25.0%"}}><Text></Text></View>
          <View style={{...styles.cell, width: "25.0%"}}><Text></Text></View>
          <View style={{...styles.cell, width: "25.0%"}}><Text></Text></View>
        </View>
      </View>
      <Text style={styles.p}>2. Details of fines / penalties /punishment/ award/ compounding fees/ settlement amount paid in proceedings (by the entity or by directors / KMPs) with regulators/ law enforcement agencies/ judicial institutions, in the financial year, in the following format (Note: the entity shall make disclosures on the basis of materiality as specified in Regulation 30 of SEBI (Listing Obligations and Disclosure Obligations) Regulations, 2015 and as disclosed on the entity’s website):</Text>
      <View style={styles.table}>
        <View style={styles.row}>
          <View style={{...styles.cell, width: "16.666666666666668%"}}><Text></Text></View>
          <View style={{...styles.cell, width: "16.666666666666668%"}}><Text></Text></View>
          <View style={{...styles.cell, width: "16.666666666666668%"}}><Text></Text></View>
          <View style={{...styles.cell, width: "16.666666666666668%"}}><Text></Text></View>
          <View style={{...styles.cell, width: "16.666666666666668%"}}><Text></Text></View>
          <View style={{...styles.cell, width: "16.666666666666668%"}}><Text></Text></View>
        </View>
        <View style={styles.row}>
          <View style={{...styles.cell, width: "16.666666666666668%"}}><Text></Text></View>
          <View style={{...styles.cell, width: "16.666666666666668%"}}><Text>NGRBC Principle</Text></View>
          <View style={{...styles.cell, width: "16.666666666666668%"}}><Text></Text></View>
          <View style={{...styles.cell, width: "16.666666666666668%"}}><Text></Text></View>
          <View style={{...styles.cell, width: "16.666666666666668%"}}><Text></Text></View>
          <View style={{...styles.cell, width: "16.666666666666668%"}}><Text></Text></View>
        </View>
        <View style={styles.row}>
          <View style={{...styles.cell, width: "16.666666666666668%"}}><Text></Text></View>
          <View style={{...styles.cell, width: "16.666666666666668%"}}><Text></Text></View>
          <View style={{...styles.cell, width: "16.666666666666668%"}}><Text></Text></View>
          <View style={{...styles.cell, width: "16.666666666666668%"}}><Text></Text></View>
          <View style={{...styles.cell, width: "16.666666666666668%"}}><Text></Text></View>
          <View style={{...styles.cell, width: "16.666666666666668%"}}><Text></Text></View>
        </View>
        <View style={styles.row}>
          <View style={{...styles.cell, width: "16.666666666666668%"}}><Text>Penalty/ Fine</Text></View>
          <View style={{...styles.cell, width: "16.666666666666668%"}}><Text>Principle 1</Text></View>
          <View style={{...styles.cell, width: "16.666666666666668%"}}><Text></Text></View>
          <View style={{...styles.cell, width: "16.666666666666668%"}}><Text></Text></View>
          <View style={{...styles.cell, width: "16.666666666666668%"}}><Text></Text></View>
          <View style={{...styles.cell, width: "16.666666666666668%"}}><Text></Text></View>
        </View>
        <View style={styles.row}>
          <View style={{...styles.cell, width: "16.666666666666668%"}}><Text>Settlement</Text></View>
          <View style={{...styles.cell, width: "16.666666666666668%"}}><Text>Nil</Text></View>
          <View style={{...styles.cell, width: "16.666666666666668%"}}><Text></Text></View>
          <View style={{...styles.cell, width: "16.666666666666668%"}}><Text></Text></View>
          <View style={{...styles.cell, width: "16.666666666666668%"}}><Text></Text></View>
          <View style={{...styles.cell, width: "16.666666666666668%"}}><Text></Text></View>
        </View>
        <View style={styles.row}>
          <View style={{...styles.cell, width: "16.666666666666668%"}}><Text>Compounding fee</Text></View>
          <View style={{...styles.cell, width: "16.666666666666668%"}}><Text>Nil</Text></View>
          <View style={{...styles.cell, width: "16.666666666666668%"}}><Text></Text></View>
          <View style={{...styles.cell, width: "16.666666666666668%"}}><Text></Text></View>
          <View style={{...styles.cell, width: "16.666666666666668%"}}><Text></Text></View>
          <View style={{...styles.cell, width: "16.666666666666668%"}}><Text></Text></View>
        </View>
      </View>
      <View style={styles.table}>
        <View style={styles.row}>
          <View style={{...styles.cell, width: "20.0%"}}><Text></Text></View>
          <View style={{...styles.cell, width: "20.0%"}}><Text>NGRBC Principle</Text></View>
          <View style={{...styles.cell, width: "20.0%"}}><Text></Text></View>
          <View style={{...styles.cell, width: "20.0%"}}><Text></Text></View>
          <View style={{...styles.cell, width: "20.0%"}}><Text></Text></View>
        </View>
        <View style={styles.row}>
          <View style={{...styles.cell, width: "20.0%"}}><Text>Imprisonment</Text></View>
          <View style={{...styles.cell, width: "20.0%"}}><Text>Nil</Text></View>
          <View style={{...styles.cell, width: "20.0%"}}><Text></Text></View>
          <View style={{...styles.cell, width: "20.0%"}}><Text></Text></View>
          <View style={{...styles.cell, width: "20.0%"}}><Text></Text></View>
        </View>
        <View style={styles.row}>
          <View style={{...styles.cell, width: "20.0%"}}><Text>Punishment</Text></View>
          <View style={{...styles.cell, width: "20.0%"}}><Text>Nil</Text></View>
          <View style={{...styles.cell, width: "20.0%"}}><Text></Text></View>
          <View style={{...styles.cell, width: "20.0%"}}><Text></Text></View>
          <View style={{...styles.cell, width: "20.0%"}}><Text></Text></View>
        </View>
      </View>
      <Text style={styles.p}>3. Of the instances disclosed in Question 2 above, details of the Appeal/ Revision preferred in cases where monetary or non-monetary action has been appealed.</Text>
      <View style={styles.table}>
        <View style={styles.row}>
          <View style={{...styles.cell, width: "50.0%"}}><Text>Case Details</Text></View>
          <View style={{...styles.cell, width: "50.0%"}}><Text>Name of the regulatory/ enforcement agencies/ judicial institutions</Text></View>
        </View>
        <View style={styles.row}>
          <View style={{...styles.cell, width: "50.0%"}}><Text>NA</Text></View>
          <View style={{...styles.cell, width: "50.0%"}}><Text>NA</Text></View>
        </View>
      </View>
      <Text style={styles.p}>4. Does the entity have an anti-corruption or anti-bribery policy? If yes, provide details in brief and if available, provide a web-link to the policy.</Text>
      <Text style={styles.p}>5. Number of Directors/KMPs/employees/workers against whom disciplinary action was taken by any law enforcement agency for the charges of bribery/ corruption:</Text>
      <View style={styles.table}>
        <View style={styles.row}>
          <View style={{...styles.cell, width: "33.333333333333336%"}}><Text>Case Details</Text></View>
          <View style={{...styles.cell, width: "33.333333333333336%"}}><Text>FY (2024-25)  (Current Financial Year)</Text></View>
          <View style={{...styles.cell, width: "33.333333333333336%"}}><Text></Text></View>
        </View>
        <View style={styles.row}>
          <View style={{...styles.cell, width: "33.333333333333336%"}}><Text>Directors</Text></View>
          <View style={{...styles.cell, width: "33.333333333333336%"}}><Text>0</Text></View>
          <View style={{...styles.cell, width: "33.333333333333336%"}}><Text></Text></View>
        </View>
        <View style={styles.row}>
          <View style={{...styles.cell, width: "33.333333333333336%"}}><Text>KMPs</Text></View>
          <View style={{...styles.cell, width: "33.333333333333336%"}}><Text>0</Text></View>
          <View style={{...styles.cell, width: "33.333333333333336%"}}><Text></Text></View>
        </View>
        <View style={styles.row}>
          <View style={{...styles.cell, width: "33.333333333333336%"}}><Text>Employees</Text></View>
          <View style={{...styles.cell, width: "33.333333333333336%"}}><Text>0</Text></View>
          <View style={{...styles.cell, width: "33.333333333333336%"}}><Text></Text></View>
        </View>
        <View style={styles.row}>
          <View style={{...styles.cell, width: "33.333333333333336%"}}><Text>Workers</Text></View>
          <View style={{...styles.cell, width: "33.333333333333336%"}}><Text>0</Text></View>
          <View style={{...styles.cell, width: "33.333333333333336%"}}><Text></Text></View>
        </View>
      </View>
      <Text style={styles.p}>6. Details of complaints with regard to conflict of interest:</Text>
      <View style={styles.table}>
        <View style={styles.row}>
          <View style={{...styles.cell, width: "20.0%"}}><Text>Case Details</Text></View>
          <View style={{...styles.cell, width: "20.0%"}}><Text></Text></View>
          <View style={{...styles.cell, width: "20.0%"}}><Text></Text></View>
          <View style={{...styles.cell, width: "20.0%"}}><Text></Text></View>
          <View style={{...styles.cell, width: "20.0%"}}><Text></Text></View>
        </View>
        <View style={styles.row}>
          <View style={{...styles.cell, width: "20.0%"}}><Text></Text></View>
          <View style={{...styles.cell, width: "20.0%"}}><Text>Number</Text></View>
          <View style={{...styles.cell, width: "20.0%"}}><Text></Text></View>
          <View style={{...styles.cell, width: "20.0%"}}><Text></Text></View>
          <View style={{...styles.cell, width: "20.0%"}}><Text></Text></View>
        </View>
        <View style={styles.row}>
          <View style={{...styles.cell, width: "20.0%"}}><Text>Number of complaints received in relation to issues of Conflict of Interest of the Directors</Text></View>
          <View style={{...styles.cell, width: "20.0%"}}><Text>0</Text></View>
          <View style={{...styles.cell, width: "20.0%"}}><Text></Text></View>
          <View style={{...styles.cell, width: "20.0%"}}><Text></Text></View>
          <View style={{...styles.cell, width: "20.0%"}}><Text></Text></View>
        </View>
        <View style={styles.row}>
          <View style={{...styles.cell, width: "20.0%"}}><Text>Number of complaints received in relation to issues of Conflict of Interest of the KMPs</Text></View>
          <View style={{...styles.cell, width: "20.0%"}}><Text>0</Text></View>
          <View style={{...styles.cell, width: "20.0%"}}><Text></Text></View>
          <View style={{...styles.cell, width: "20.0%"}}><Text></Text></View>
          <View style={{...styles.cell, width: "20.0%"}}><Text></Text></View>
        </View>
      </View>
      <Text style={styles.p}>7. Provide details of any corrective action taken or underway on issues related to fines / penalties / action taken by regulators/ law enforcement agencies/ judicial institutions, on cases of corruption and conflicts of interest.</Text>
      <Text style={styles.p}>8. Number of Directors/KMPs/employees/workers against whom disciplinary action was taken by any law enforcement agency for the charges of bribery/ corruption:</Text>
      <View style={styles.table}>
        <View style={styles.row}>
          <View style={{...styles.cell, width: "33.333333333333336%"}}><Text></Text></View>
          <View style={{...styles.cell, width: "33.333333333333336%"}}><Text>FY (2024-25)</Text></View>
          <View style={{...styles.cell, width: "33.333333333333336%"}}><Text></Text></View>
        </View>
        <View style={styles.row}>
          <View style={{...styles.cell, width: "33.333333333333336%"}}><Text>Number of	days of accounts payables</Text></View>
          <View style={{...styles.cell, width: "33.333333333333336%"}}><Text></Text></View>
          <View style={{...styles.cell, width: "33.333333333333336%"}}><Text></Text></View>
        </View>
      </View>
      <Text style={styles.p}>9. Open-ness of business Provide details of concentration of purchases and sales with trading houses, dealers, and related parties along-with loans and advances &amp; investments, with related parties,in the following format:</Text>
      <View style={styles.table}>
        <View style={styles.row}>
          <View style={{...styles.cell, width: "25.0%"}}><Text>Parameter</Text></View>
          <View style={{...styles.cell, width: "25.0%"}}><Text>Metrics</Text></View>
          <View style={{...styles.cell, width: "25.0%"}}><Text></Text></View>
          <View style={{...styles.cell, width: "25.0%"}}><Text></Text></View>
        </View>
        <View style={styles.row}>
          <View style={{...styles.cell, width: "25.0%"}}><Text>Concentration of Purchases</Text></View>
          <View style={{...styles.cell, width: "25.0%"}}><Text>a. Purchases from trading houses as % of total purchases</Text></View>
          <View style={{...styles.cell, width: "25.0%"}}><Text></Text></View>
          <View style={{...styles.cell, width: "25.0%"}}><Text></Text></View>
        </View>
        <View style={styles.row}>
          <View style={{...styles.cell, width: "25.0%"}}><Text>Concentration of Purchases</Text></View>
          <View style={{...styles.cell, width: "25.0%"}}><Text>b. Number of trading houses where purchases are made from</Text></View>
          <View style={{...styles.cell, width: "25.0%"}}><Text></Text></View>
          <View style={{...styles.cell, width: "25.0%"}}><Text></Text></View>
        </View>
        <View style={styles.row}>
          <View style={{...styles.cell, width: "25.0%"}}><Text>Concentration of Purchases</Text></View>
          <View style={{...styles.cell, width: "25.0%"}}><Text>c. Purchases from top 10 trading houses as % of total purchases from  trading houses</Text></View>
          <View style={{...styles.cell, width: "25.0%"}}><Text></Text></View>
          <View style={{...styles.cell, width: "25.0%"}}><Text></Text></View>
        </View>
        <View style={styles.row}>
          <View style={{...styles.cell, width: "25.0%"}}><Text>Concentration of Sales</Text></View>
          <View style={{...styles.cell, width: "25.0%"}}><Text>Sales to dealers	/  distributors as% of total sales</Text></View>
          <View style={{...styles.cell, width: "25.0%"}}><Text></Text></View>
          <View style={{...styles.cell, width: "25.0%"}}><Text></Text></View>
        </View>
        <View style={styles.row}>
          <View style={{...styles.cell, width: "25.0%"}}><Text>Concentration of Sales</Text></View>
          <View style={{...styles.cell, width: "25.0%"}}><Text>b. Number of dealers / distributors to whom sales are made</Text></View>
          <View style={{...styles.cell, width: "25.0%"}}><Text></Text></View>
          <View style={{...styles.cell, width: "25.0%"}}><Text></Text></View>
        </View>
        <View style={styles.row}>
          <View style={{...styles.cell, width: "25.0%"}}><Text>Concentration of Sales</Text></View>
          <View style={{...styles.cell, width: "25.0%"}}><Text>c. Sales to top 10 dealers/ distributors as % of  total sales to dealers / distributors</Text></View>
          <View style={{...styles.cell, width: "25.0%"}}><Text></Text></View>
          <View style={{...styles.cell, width: "25.0%"}}><Text></Text></View>
        </View>
        <View style={styles.row}>
          <View style={{...styles.cell, width: "25.0%"}}><Text>Share of RPTs in</Text></View>
          <View style={{...styles.cell, width: "25.0%"}}><Text>Purchases (Purchases with related parties / Total Purchases)</Text></View>
          <View style={{...styles.cell, width: "25.0%"}}><Text></Text></View>
          <View style={{...styles.cell, width: "25.0%"}}><Text></Text></View>
        </View>
        <View style={styles.row}>
          <View style={{...styles.cell, width: "25.0%"}}><Text>Share of RPTs in</Text></View>
          <View style={{...styles.cell, width: "25.0%"}}><Text>b.  Sales (Sales to related  parties / Total Sales)</Text></View>
          <View style={{...styles.cell, width: "25.0%"}}><Text></Text></View>
          <View style={{...styles.cell, width: "25.0%"}}><Text></Text></View>
        </View>
        <View style={styles.row}>
          <View style={{...styles.cell, width: "25.0%"}}><Text>Share of RPTs in</Text></View>
          <View style={{...styles.cell, width: "25.0%"}}><Text>c. Loans &amp; advances (Loans &amp; advances given to related parties / Total loans &amp; advances)</Text></View>
          <View style={{...styles.cell, width: "25.0%"}}><Text></Text></View>
          <View style={{...styles.cell, width: "25.0%"}}><Text></Text></View>
        </View>
        <View style={styles.row}>
          <View style={{...styles.cell, width: "25.0%"}}><Text>Share of RPTs in</Text></View>
          <View style={{...styles.cell, width: "25.0%"}}><Text>d.  Investments  ( Investments in related parties / Total Investments made)</Text></View>
          <View style={{...styles.cell, width: "25.0%"}}><Text></Text></View>
          <View style={{...styles.cell, width: "25.0%"}}><Text></Text></View>
        </View>
      </View>
      <Text style={styles.p}>Leadership Indicators</Text>
      <Text style={styles.p}>1. Awareness programmes conducted for value chain partners on any of the Principles during the financial year:</Text>
      <View style={styles.table}>
        <View style={styles.row}>
          <View style={{...styles.cell, width: "33.333333333333336%"}}><Text>Total number of awareness programmes held</Text></View>
          <View style={{...styles.cell, width: "33.333333333333336%"}}><Text>Topics / principles covered under the training</Text></View>
          <View style={{...styles.cell, width: "33.333333333333336%"}}><Text></Text></View>
        </View>
        <View style={styles.row}>
          <View style={{...styles.cell, width: "33.333333333333336%"}}><Text>1</Text></View>
          <View style={{...styles.cell, width: "33.333333333333336%"}}><Text>Training Session @ Sustainability - CO2 calculation for work site</Text></View>
          <View style={{...styles.cell, width: "33.333333333333336%"}}><Text></Text></View>
        </View>
      </View>
      <Text style={styles.p}>2. Does the entity have processes in place to avoid/ manage conflict of interests involving members of the Board? (Yes/No) If Yes, provide details of the same.</Text>
      <Text style={styles.p}>Essential Indicators</Text>
      <Text style={styles.p}>1. Percentage of R&amp;D and capital expenditure (capex) investments in specific technologies to improve the environmental and social impacts of product and processes to total R&amp;D and capex investments made by the entity, respectively.</Text>
      <View style={styles.table}>
        <View style={styles.row}>
          <View style={{...styles.cell, width: "25.0%"}}><Text></Text></View>
          <View style={{...styles.cell, width: "25.0%"}}><Text>Current Financial Year</Text></View>
          <View style={{...styles.cell, width: "25.0%"}}><Text></Text></View>
          <View style={{...styles.cell, width: "25.0%"}}><Text></Text></View>
        </View>
        <View style={styles.row}>
          <View style={{...styles.cell, width: "25.0%"}}><Text>R&amp;D</Text></View>
          <View style={{...styles.cell, width: "25.0%"}}><Text></Text></View>
          <View style={{...styles.cell, width: "25.0%"}}><Text></Text></View>
          <View style={{...styles.cell, width: "25.0%"}}><Text></Text></View>
        </View>
        <View style={styles.row}>
          <View style={{...styles.cell, width: "25.0%"}}><Text>Capex</Text></View>
          <View style={{...styles.cell, width: "25.0%"}}><Text></Text></View>
          <View style={{...styles.cell, width: "25.0%"}}><Text></Text></View>
          <View style={{...styles.cell, width: "25.0%"}}><Text></Text></View>
        </View>
      </View>
      <Text style={styles.p}>2.  A. Does the entity have procedures in place for sustainable sourcing? (Yes/No)</Text>
      <Text style={styles.p}>- Yes,</Text>
      <Text style={styles.p}>B. If yes, what percentage of inputs were sourced sustainably?</Text>
      <Text style={styles.p}>- ROHS and REACH compliance collected and verified received steel and brass materials on define frequency.</Text>
      <Text style={styles.p}>3. Describe the processes in place to safely reclaim your products for reusing, recycling and disposing at the end of life, for (a) Plastics (including packaging) (b) E-waste (c) Hazardous waste and (d) other waste.</Text>
      <View style={styles.table}>
        <View style={styles.row}>
          <View style={{...styles.cell, width: "50.0%"}}><Text>(a) Plastics (including packaging)</Text></View>
          <View style={{...styles.cell, width: "50.0%"}}><Text>Disposed to registered recyclers as per EPR norms</Text></View>
        </View>
        <View style={styles.row}>
          <View style={{...styles.cell, width: "50.0%"}}><Text>(b) E-waste</Text></View>
          <View style={{...styles.cell, width: "50.0%"}}><Text>Disposed to registered recyclers as per E-waste norms</Text></View>
        </View>
        <View style={styles.row}>
          <View style={{...styles.cell, width: "50.0%"}}><Text>(c) Hazardous waste</Text></View>
          <View style={{...styles.cell, width: "50.0%"}}><Text>Disposed to the cement plant for co-processing. ETP sludge &amp; other hazardous   waste is sent to registered recyclers as per hazardous waste norms.</Text></View>
        </View>
        <View style={styles.row}>
          <View style={{...styles.cell, width: "50.0%"}}><Text>(d) other waste</Text></View>
          <View style={{...styles.cell, width: "50.0%"}}><Text>Disposed to registered recyclers</Text></View>
        </View>
      </View>
      <Text style={styles.p}>4. Whether Extended Producer Responsibility (EPR) is applicable to the entity’s activities (Yes / No). If yes, whether the waste collection plan is in line with the Extended Producer Responsibility (EPR) plan submitted to Pollution Control Boards? If not, provide steps taken to address the same.</Text>
      <Text style={styles.p}>Leadership Indicators</Text>
      <Text style={styles.p}>1. Has the entity conducted Life Cycle Perspective / Assessments (LCA) for any of its products (for manufacturing industry) or for its services (for service industry)? If yes, provide details in the following format?</Text>
      <View style={styles.table}>
        <View style={styles.row}>
          <View style={{...styles.cell, width: "16.666666666666668%"}}><Text>NIC Code</Text></View>
          <View style={{...styles.cell, width: "16.666666666666668%"}}><Text>Name of Product /Service</Text></View>
          <View style={{...styles.cell, width: "16.666666666666668%"}}><Text></Text></View>
          <View style={{...styles.cell, width: "16.666666666666668%"}}><Text></Text></View>
          <View style={{...styles.cell, width: "16.666666666666668%"}}><Text></Text></View>
          <View style={{...styles.cell, width: "16.666666666666668%"}}><Text></Text></View>
        </View>
        <View style={styles.row}>
          <View style={{...styles.cell, width: "16.666666666666668%"}}><Text></Text></View>
          <View style={{...styles.cell, width: "16.666666666666668%"}}><Text></Text></View>
          <View style={{...styles.cell, width: "16.666666666666668%"}}><Text></Text></View>
          <View style={{...styles.cell, width: "16.666666666666668%"}}><Text></Text></View>
          <View style={{...styles.cell, width: "16.666666666666668%"}}><Text></Text></View>
          <View style={{...styles.cell, width: "16.666666666666668%"}}><Text></Text></View>
        </View>
      </View>
      <Text style={styles.p}>2. If there are any significant social or environmental concerns and/or risks arising from production or disposal of your products / services, as identified in the Life Cycle Perspective / Assessments (LCA) or through any other means, briefly describe the same along-with action taken to mitigate the same.</Text>
      <View style={styles.table}>
        <View style={styles.row}>
          <View style={{...styles.cell, width: "33.333333333333336%"}}><Text>Name of Product / Service</Text></View>
          <View style={{...styles.cell, width: "33.333333333333336%"}}><Text>Description of the risk / concern</Text></View>
          <View style={{...styles.cell, width: "33.333333333333336%"}}><Text></Text></View>
        </View>
        <View style={styles.row}>
          <View style={{...styles.cell, width: "33.333333333333336%"}}><Text></Text></View>
          <View style={{...styles.cell, width: "33.333333333333336%"}}><Text></Text></View>
          <View style={{...styles.cell, width: "33.333333333333336%"}}><Text></Text></View>
        </View>
        <View style={styles.row}>
          <View style={{...styles.cell, width: "33.333333333333336%"}}><Text></Text></View>
          <View style={{...styles.cell, width: "33.333333333333336%"}}><Text></Text></View>
          <View style={{...styles.cell, width: "33.333333333333336%"}}><Text></Text></View>
        </View>
        <View style={styles.row}>
          <View style={{...styles.cell, width: "33.333333333333336%"}}><Text></Text></View>
          <View style={{...styles.cell, width: "33.333333333333336%"}}><Text></Text></View>
          <View style={{...styles.cell, width: "33.333333333333336%"}}><Text></Text></View>
        </View>
        <View style={styles.row}>
          <View style={{...styles.cell, width: "33.333333333333336%"}}><Text></Text></View>
          <View style={{...styles.cell, width: "33.333333333333336%"}}><Text></Text></View>
          <View style={{...styles.cell, width: "33.333333333333336%"}}><Text></Text></View>
        </View>
      </View>
      <Text style={styles.p}>3. Percentage of recycled or reused input material to total material (by value) used in production (for manufacturing industry) or providing services (for service industry).</Text>
      <View style={styles.table}>
        <View style={styles.row}>
          <View style={{...styles.cell, width: "33.333333333333336%"}}><Text>Indicate input material</Text></View>
          <View style={{...styles.cell, width: "33.333333333333336%"}}><Text></Text></View>
          <View style={{...styles.cell, width: "33.333333333333336%"}}><Text></Text></View>
        </View>
        <View style={styles.row}>
          <View style={{...styles.cell, width: "33.333333333333336%"}}><Text>Indicate input material</Text></View>
          <View style={{...styles.cell, width: "33.333333333333336%"}}><Text>FY (2024-25) Current Financial Year</Text></View>
          <View style={{...styles.cell, width: "33.333333333333336%"}}><Text></Text></View>
        </View>
        <View style={styles.row}>
          <View style={{...styles.cell, width: "33.333333333333336%"}}><Text></Text></View>
          <View style={{...styles.cell, width: "33.333333333333336%"}}><Text>39768</Text></View>
          <View style={{...styles.cell, width: "33.333333333333336%"}}><Text></Text></View>
        </View>
      </View>
      <Text style={styles.p}>Of the products and packaging reclaimed at end of life of products, amount (in metric tonnes) reused, recycled, and safely disposed, as per the following format:</Text>
      <View style={styles.table}>
        <View style={styles.row}>
          <View style={{...styles.cell, width: "14.285714285714286%"}}><Text></Text></View>
          <View style={{...styles.cell, width: "14.285714285714286%"}}><Text></Text></View>
          <View style={{...styles.cell, width: "14.285714285714286%"}}><Text></Text></View>
          <View style={{...styles.cell, width: "14.285714285714286%"}}><Text></Text></View>
          <View style={{...styles.cell, width: "14.285714285714286%"}}><Text></Text></View>
          <View style={{...styles.cell, width: "14.285714285714286%"}}><Text></Text></View>
          <View style={{...styles.cell, width: "14.285714285714286%"}}><Text></Text></View>
        </View>
        <View style={styles.row}>
          <View style={{...styles.cell, width: "14.285714285714286%"}}><Text></Text></View>
          <View style={{...styles.cell, width: "14.285714285714286%"}}><Text>Re-Used</Text></View>
          <View style={{...styles.cell, width: "14.285714285714286%"}}><Text></Text></View>
          <View style={{...styles.cell, width: "14.285714285714286%"}}><Text></Text></View>
          <View style={{...styles.cell, width: "14.285714285714286%"}}><Text></Text></View>
          <View style={{...styles.cell, width: "14.285714285714286%"}}><Text></Text></View>
          <View style={{...styles.cell, width: "14.285714285714286%"}}><Text></Text></View>
        </View>
        <View style={styles.row}>
          <View style={{...styles.cell, width: "14.285714285714286%"}}><Text>Plastics (including  packaging)</Text></View>
          <View style={{...styles.cell, width: "14.285714285714286%"}}><Text></Text></View>
          <View style={{...styles.cell, width: "14.285714285714286%"}}><Text></Text></View>
          <View style={{...styles.cell, width: "14.285714285714286%"}}><Text></Text></View>
          <View style={{...styles.cell, width: "14.285714285714286%"}}><Text></Text></View>
          <View style={{...styles.cell, width: "14.285714285714286%"}}><Text></Text></View>
          <View style={{...styles.cell, width: "14.285714285714286%"}}><Text></Text></View>
        </View>
        <View style={styles.row}>
          <View style={{...styles.cell, width: "14.285714285714286%"}}><Text>E-waste</Text></View>
          <View style={{...styles.cell, width: "14.285714285714286%"}}><Text></Text></View>
          <View style={{...styles.cell, width: "14.285714285714286%"}}><Text></Text></View>
          <View style={{...styles.cell, width: "14.285714285714286%"}}><Text></Text></View>
          <View style={{...styles.cell, width: "14.285714285714286%"}}><Text></Text></View>
          <View style={{...styles.cell, width: "14.285714285714286%"}}><Text></Text></View>
          <View style={{...styles.cell, width: "14.285714285714286%"}}><Text></Text></View>
        </View>
        <View style={styles.row}>
          <View style={{...styles.cell, width: "14.285714285714286%"}}><Text>Hazardous  waste</Text></View>
          <View style={{...styles.cell, width: "14.285714285714286%"}}><Text></Text></View>
          <View style={{...styles.cell, width: "14.285714285714286%"}}><Text></Text></View>
          <View style={{...styles.cell, width: "14.285714285714286%"}}><Text></Text></View>
          <View style={{...styles.cell, width: "14.285714285714286%"}}><Text></Text></View>
          <View style={{...styles.cell, width: "14.285714285714286%"}}><Text></Text></View>
          <View style={{...styles.cell, width: "14.285714285714286%"}}><Text></Text></View>
        </View>
        <View style={styles.row}>
          <View style={{...styles.cell, width: "14.285714285714286%"}}><Text>Other  waste</Text></View>
          <View style={{...styles.cell, width: "14.285714285714286%"}}><Text></Text></View>
          <View style={{...styles.cell, width: "14.285714285714286%"}}><Text></Text></View>
          <View style={{...styles.cell, width: "14.285714285714286%"}}><Text></Text></View>
          <View style={{...styles.cell, width: "14.285714285714286%"}}><Text></Text></View>
          <View style={{...styles.cell, width: "14.285714285714286%"}}><Text></Text></View>
          <View style={{...styles.cell, width: "14.285714285714286%"}}><Text></Text></View>
        </View>
      </View>
      <Text style={styles.p}>Reclaimed products and their packaging materials (as percentage of products sold) for each product category.</Text>
      <View style={styles.table}>
        <View style={styles.row}>
          <View style={{...styles.cell, width: "50.0%"}}><Text>Indicate product category</Text></View>
          <View style={{...styles.cell, width: "50.0%"}}><Text>Reclaimed products and their packaging materials as % of total products sold in respective category</Text></View>
        </View>
        <View style={styles.row}>
          <View style={{...styles.cell, width: "50.0%"}}><Text></Text></View>
          <View style={{...styles.cell, width: "50.0%"}}><Text></Text></View>
        </View>
      </View>
      <Text style={styles.p}>Essential Indicators</Text>
      <Text style={styles.p}>a. Details of measures for the well-being of employees:</Text>
      <View style={styles.table}>
        <View style={styles.row}>
          <View style={{...styles.cell, width: "8.333333333333334%"}}><Text>Category</Text></View>
          <View style={{...styles.cell, width: "8.333333333333334%"}}><Text></Text></View>
          <View style={{...styles.cell, width: "8.333333333333334%"}}><Text></Text></View>
          <View style={{...styles.cell, width: "8.333333333333334%"}}><Text></Text></View>
          <View style={{...styles.cell, width: "8.333333333333334%"}}><Text></Text></View>
          <View style={{...styles.cell, width: "8.333333333333334%"}}><Text></Text></View>
          <View style={{...styles.cell, width: "8.333333333333334%"}}><Text></Text></View>
          <View style={{...styles.cell, width: "8.333333333333334%"}}><Text></Text></View>
          <View style={{...styles.cell, width: "8.333333333333334%"}}><Text></Text></View>
          <View style={{...styles.cell, width: "8.333333333333334%"}}><Text></Text></View>
          <View style={{...styles.cell, width: "8.333333333333334%"}}><Text></Text></View>
          <View style={{...styles.cell, width: "8.333333333333334%"}}><Text></Text></View>
        </View>
        <View style={styles.row}>
          <View style={{...styles.cell, width: "8.333333333333334%"}}><Text>Category</Text></View>
          <View style={{...styles.cell, width: "8.333333333333334%"}}><Text>Total (A)</Text></View>
          <View style={{...styles.cell, width: "8.333333333333334%"}}><Text></Text></View>
          <View style={{...styles.cell, width: "8.333333333333334%"}}><Text></Text></View>
          <View style={{...styles.cell, width: "8.333333333333334%"}}><Text></Text></View>
          <View style={{...styles.cell, width: "8.333333333333334%"}}><Text></Text></View>
          <View style={{...styles.cell, width: "8.333333333333334%"}}><Text></Text></View>
          <View style={{...styles.cell, width: "8.333333333333334%"}}><Text></Text></View>
          <View style={{...styles.cell, width: "8.333333333333334%"}}><Text></Text></View>
          <View style={{...styles.cell, width: "8.333333333333334%"}}><Text></Text></View>
          <View style={{...styles.cell, width: "8.333333333333334%"}}><Text></Text></View>
          <View style={{...styles.cell, width: "8.333333333333334%"}}><Text></Text></View>
        </View>
        <View style={styles.row}>
          <View style={{...styles.cell, width: "8.333333333333334%"}}><Text>Category</Text></View>
          <View style={{...styles.cell, width: "8.333333333333334%"}}><Text>Total (A)</Text></View>
          <View style={{...styles.cell, width: "8.333333333333334%"}}><Text></Text></View>
          <View style={{...styles.cell, width: "8.333333333333334%"}}><Text></Text></View>
          <View style={{...styles.cell, width: "8.333333333333334%"}}><Text></Text></View>
          <View style={{...styles.cell, width: "8.333333333333334%"}}><Text></Text></View>
          <View style={{...styles.cell, width: "8.333333333333334%"}}><Text></Text></View>
          <View style={{...styles.cell, width: "8.333333333333334%"}}><Text></Text></View>
          <View style={{...styles.cell, width: "8.333333333333334%"}}><Text></Text></View>
          <View style={{...styles.cell, width: "8.333333333333334%"}}><Text></Text></View>
          <View style={{...styles.cell, width: "8.333333333333334%"}}><Text></Text></View>
          <View style={{...styles.cell, width: "8.333333333333334%"}}><Text></Text></View>
        </View>
        <View style={styles.row}>
          <View style={{...styles.cell, width: "8.333333333333334%"}}><Text></Text></View>
          <View style={{...styles.cell, width: "8.333333333333334%"}}><Text></Text></View>
          <View style={{...styles.cell, width: "8.333333333333334%"}}><Text></Text></View>
          <View style={{...styles.cell, width: "8.333333333333334%"}}><Text></Text></View>
          <View style={{...styles.cell, width: "8.333333333333334%"}}><Text></Text></View>
          <View style={{...styles.cell, width: "8.333333333333334%"}}><Text></Text></View>
          <View style={{...styles.cell, width: "8.333333333333334%"}}><Text></Text></View>
          <View style={{...styles.cell, width: "8.333333333333334%"}}><Text></Text></View>
          <View style={{...styles.cell, width: "8.333333333333334%"}}><Text></Text></View>
          <View style={{...styles.cell, width: "8.333333333333334%"}}><Text></Text></View>
          <View style={{...styles.cell, width: "8.333333333333334%"}}><Text></Text></View>
          <View style={{...styles.cell, width: "8.333333333333334%"}}><Text></Text></View>
        </View>
        <View style={styles.row}>
          <View style={{...styles.cell, width: "8.333333333333334%"}}><Text>Male</Text></View>
          <View style={{...styles.cell, width: "8.333333333333334%"}}><Text></Text></View>
          <View style={{...styles.cell, width: "8.333333333333334%"}}><Text></Text></View>
          <View style={{...styles.cell, width: "8.333333333333334%"}}><Text></Text></View>
          <View style={{...styles.cell, width: "8.333333333333334%"}}><Text></Text></View>
          <View style={{...styles.cell, width: "8.333333333333334%"}}><Text></Text></View>
          <View style={{...styles.cell, width: "8.333333333333334%"}}><Text></Text></View>
          <View style={{...styles.cell, width: "8.333333333333334%"}}><Text></Text></View>
          <View style={{...styles.cell, width: "8.333333333333334%"}}><Text></Text></View>
          <View style={{...styles.cell, width: "8.333333333333334%"}}><Text></Text></View>
          <View style={{...styles.cell, width: "8.333333333333334%"}}><Text></Text></View>
          <View style={{...styles.cell, width: "8.333333333333334%"}}><Text></Text></View>
        </View>
        <View style={styles.row}>
          <View style={{...styles.cell, width: "8.333333333333334%"}}><Text>Female</Text></View>
          <View style={{...styles.cell, width: "8.333333333333334%"}}><Text></Text></View>
          <View style={{...styles.cell, width: "8.333333333333334%"}}><Text></Text></View>
          <View style={{...styles.cell, width: "8.333333333333334%"}}><Text></Text></View>
          <View style={{...styles.cell, width: "8.333333333333334%"}}><Text></Text></View>
          <View style={{...styles.cell, width: "8.333333333333334%"}}><Text></Text></View>
          <View style={{...styles.cell, width: "8.333333333333334%"}}><Text></Text></View>
          <View style={{...styles.cell, width: "8.333333333333334%"}}><Text></Text></View>
          <View style={{...styles.cell, width: "8.333333333333334%"}}><Text></Text></View>
          <View style={{...styles.cell, width: "8.333333333333334%"}}><Text></Text></View>
          <View style={{...styles.cell, width: "8.333333333333334%"}}><Text></Text></View>
          <View style={{...styles.cell, width: "8.333333333333334%"}}><Text></Text></View>
        </View>
        <View style={styles.row}>
          <View style={{...styles.cell, width: "8.333333333333334%"}}><Text>Total</Text></View>
          <View style={{...styles.cell, width: "8.333333333333334%"}}><Text></Text></View>
          <View style={{...styles.cell, width: "8.333333333333334%"}}><Text></Text></View>
          <View style={{...styles.cell, width: "8.333333333333334%"}}><Text></Text></View>
          <View style={{...styles.cell, width: "8.333333333333334%"}}><Text></Text></View>
          <View style={{...styles.cell, width: "8.333333333333334%"}}><Text></Text></View>
          <View style={{...styles.cell, width: "8.333333333333334%"}}><Text></Text></View>
          <View style={{...styles.cell, width: "8.333333333333334%"}}><Text></Text></View>
          <View style={{...styles.cell, width: "8.333333333333334%"}}><Text></Text></View>
          <View style={{...styles.cell, width: "8.333333333333334%"}}><Text></Text></View>
          <View style={{...styles.cell, width: "8.333333333333334%"}}><Text></Text></View>
          <View style={{...styles.cell, width: "8.333333333333334%"}}><Text></Text></View>
        </View>
        <View style={styles.row}>
          <View style={{...styles.cell, width: "8.333333333333334%"}}><Text></Text></View>
          <View style={{...styles.cell, width: "8.333333333333334%"}}><Text></Text></View>
          <View style={{...styles.cell, width: "8.333333333333334%"}}><Text></Text></View>
          <View style={{...styles.cell, width: "8.333333333333334%"}}><Text></Text></View>
          <View style={{...styles.cell, width: "8.333333333333334%"}}><Text></Text></View>
          <View style={{...styles.cell, width: "8.333333333333334%"}}><Text></Text></View>
          <View style={{...styles.cell, width: "8.333333333333334%"}}><Text></Text></View>
          <View style={{...styles.cell, width: "8.333333333333334%"}}><Text></Text></View>
          <View style={{...styles.cell, width: "8.333333333333334%"}}><Text></Text></View>
          <View style={{...styles.cell, width: "8.333333333333334%"}}><Text></Text></View>
          <View style={{...styles.cell, width: "8.333333333333334%"}}><Text></Text></View>
          <View style={{...styles.cell, width: "8.333333333333334%"}}><Text></Text></View>
        </View>
        <View style={styles.row}>
          <View style={{...styles.cell, width: "8.333333333333334%"}}><Text>Male</Text></View>
          <View style={{...styles.cell, width: "8.333333333333334%"}}><Text></Text></View>
          <View style={{...styles.cell, width: "8.333333333333334%"}}><Text></Text></View>
          <View style={{...styles.cell, width: "8.333333333333334%"}}><Text></Text></View>
          <View style={{...styles.cell, width: "8.333333333333334%"}}><Text></Text></View>
          <View style={{...styles.cell, width: "8.333333333333334%"}}><Text></Text></View>
          <View style={{...styles.cell, width: "8.333333333333334%"}}><Text></Text></View>
          <View style={{...styles.cell, width: "8.333333333333334%"}}><Text></Text></View>
          <View style={{...styles.cell, width: "8.333333333333334%"}}><Text></Text></View>
          <View style={{...styles.cell, width: "8.333333333333334%"}}><Text></Text></View>
          <View style={{...styles.cell, width: "8.333333333333334%"}}><Text></Text></View>
          <View style={{...styles.cell, width: "8.333333333333334%"}}><Text></Text></View>
        </View>
        <View style={styles.row}>
          <View style={{...styles.cell, width: "8.333333333333334%"}}><Text>Female</Text></View>
          <View style={{...styles.cell, width: "8.333333333333334%"}}><Text></Text></View>
          <View style={{...styles.cell, width: "8.333333333333334%"}}><Text></Text></View>
          <View style={{...styles.cell, width: "8.333333333333334%"}}><Text></Text></View>
          <View style={{...styles.cell, width: "8.333333333333334%"}}><Text></Text></View>
          <View style={{...styles.cell, width: "8.333333333333334%"}}><Text></Text></View>
          <View style={{...styles.cell, width: "8.333333333333334%"}}><Text></Text></View>
          <View style={{...styles.cell, width: "8.333333333333334%"}}><Text></Text></View>
          <View style={{...styles.cell, width: "8.333333333333334%"}}><Text></Text></View>
          <View style={{...styles.cell, width: "8.333333333333334%"}}><Text></Text></View>
          <View style={{...styles.cell, width: "8.333333333333334%"}}><Text></Text></View>
          <View style={{...styles.cell, width: "8.333333333333334%"}}><Text></Text></View>
        </View>
        <View style={styles.row}>
          <View style={{...styles.cell, width: "8.333333333333334%"}}><Text>Total</Text></View>
          <View style={{...styles.cell, width: "8.333333333333334%"}}><Text></Text></View>
          <View style={{...styles.cell, width: "8.333333333333334%"}}><Text></Text></View>
          <View style={{...styles.cell, width: "8.333333333333334%"}}><Text></Text></View>
          <View style={{...styles.cell, width: "8.333333333333334%"}}><Text></Text></View>
          <View style={{...styles.cell, width: "8.333333333333334%"}}><Text></Text></View>
          <View style={{...styles.cell, width: "8.333333333333334%"}}><Text></Text></View>
          <View style={{...styles.cell, width: "8.333333333333334%"}}><Text></Text></View>
          <View style={{...styles.cell, width: "8.333333333333334%"}}><Text></Text></View>
          <View style={{...styles.cell, width: "8.333333333333334%"}}><Text></Text></View>
          <View style={{...styles.cell, width: "8.333333333333334%"}}><Text></Text></View>
          <View style={{...styles.cell, width: "8.333333333333334%"}}><Text></Text></View>
        </View>
      </View>
      <Text style={styles.p}>b. Details of measures for the well-being of workers:</Text>
      <View style={styles.table}>
        <View style={styles.row}>
          <View style={{...styles.cell, width: "8.333333333333334%"}}><Text>Category</Text></View>
          <View style={{...styles.cell, width: "8.333333333333334%"}}><Text></Text></View>
          <View style={{...styles.cell, width: "8.333333333333334%"}}><Text></Text></View>
          <View style={{...styles.cell, width: "8.333333333333334%"}}><Text></Text></View>
          <View style={{...styles.cell, width: "8.333333333333334%"}}><Text></Text></View>
          <View style={{...styles.cell, width: "8.333333333333334%"}}><Text></Text></View>
          <View style={{...styles.cell, width: "8.333333333333334%"}}><Text></Text></View>
          <View style={{...styles.cell, width: "8.333333333333334%"}}><Text></Text></View>
          <View style={{...styles.cell, width: "8.333333333333334%"}}><Text></Text></View>
          <View style={{...styles.cell, width: "8.333333333333334%"}}><Text></Text></View>
          <View style={{...styles.cell, width: "8.333333333333334%"}}><Text></Text></View>
          <View style={{...styles.cell, width: "8.333333333333334%"}}><Text></Text></View>
        </View>
        <View style={styles.row}>
          <View style={{...styles.cell, width: "8.333333333333334%"}}><Text>Category</Text></View>
          <View style={{...styles.cell, width: "8.333333333333334%"}}><Text>Total (A)</Text></View>
          <View style={{...styles.cell, width: "8.333333333333334%"}}><Text></Text></View>
          <View style={{...styles.cell, width: "8.333333333333334%"}}><Text></Text></View>
          <View style={{...styles.cell, width: "8.333333333333334%"}}><Text></Text></View>
          <View style={{...styles.cell, width: "8.333333333333334%"}}><Text></Text></View>
          <View style={{...styles.cell, width: "8.333333333333334%"}}><Text></Text></View>
          <View style={{...styles.cell, width: "8.333333333333334%"}}><Text></Text></View>
          <View style={{...styles.cell, width: "8.333333333333334%"}}><Text></Text></View>
          <View style={{...styles.cell, width: "8.333333333333334%"}}><Text></Text></View>
          <View style={{...styles.cell, width: "8.333333333333334%"}}><Text></Text></View>
          <View style={{...styles.cell, width: "8.333333333333334%"}}><Text></Text></View>
        </View>
        <View style={styles.row}>
          <View style={{...styles.cell, width: "8.333333333333334%"}}><Text>Category</Text></View>
          <View style={{...styles.cell, width: "8.333333333333334%"}}><Text>Total (A)</Text></View>
          <View style={{...styles.cell, width: "8.333333333333334%"}}><Text></Text></View>
          <View style={{...styles.cell, width: "8.333333333333334%"}}><Text></Text></View>
          <View style={{...styles.cell, width: "8.333333333333334%"}}><Text></Text></View>
          <View style={{...styles.cell, width: "8.333333333333334%"}}><Text></Text></View>
          <View style={{...styles.cell, width: "8.333333333333334%"}}><Text></Text></View>
          <View style={{...styles.cell, width: "8.333333333333334%"}}><Text></Text></View>
          <View style={{...styles.cell, width: "8.333333333333334%"}}><Text></Text></View>
          <View style={{...styles.cell, width: "8.333333333333334%"}}><Text></Text></View>
          <View style={{...styles.cell, width: "8.333333333333334%"}}><Text></Text></View>
          <View style={{...styles.cell, width: "8.333333333333334%"}}><Text></Text></View>
        </View>
        <View style={styles.row}>
          <View style={{...styles.cell, width: "8.333333333333334%"}}><Text></Text></View>
          <View style={{...styles.cell, width: "8.333333333333334%"}}><Text></Text></View>
          <View style={{...styles.cell, width: "8.333333333333334%"}}><Text></Text></View>
          <View style={{...styles.cell, width: "8.333333333333334%"}}><Text></Text></View>
          <View style={{...styles.cell, width: "8.333333333333334%"}}><Text></Text></View>
          <View style={{...styles.cell, width: "8.333333333333334%"}}><Text></Text></View>
          <View style={{...styles.cell, width: "8.333333333333334%"}}><Text></Text></View>
          <View style={{...styles.cell, width: "8.333333333333334%"}}><Text></Text></View>
          <View style={{...styles.cell, width: "8.333333333333334%"}}><Text></Text></View>
          <View style={{...styles.cell, width: "8.333333333333334%"}}><Text></Text></View>
          <View style={{...styles.cell, width: "8.333333333333334%"}}><Text></Text></View>
          <View style={{...styles.cell, width: "8.333333333333334%"}}><Text></Text></View>
        </View>
        <View style={styles.row}>
          <View style={{...styles.cell, width: "8.333333333333334%"}}><Text>Male</Text></View>
          <View style={{...styles.cell, width: "8.333333333333334%"}}><Text></Text></View>
          <View style={{...styles.cell, width: "8.333333333333334%"}}><Text></Text></View>
          <View style={{...styles.cell, width: "8.333333333333334%"}}><Text></Text></View>
          <View style={{...styles.cell, width: "8.333333333333334%"}}><Text></Text></View>
          <View style={{...styles.cell, width: "8.333333333333334%"}}><Text></Text></View>
          <View style={{...styles.cell, width: "8.333333333333334%"}}><Text></Text></View>
          <View style={{...styles.cell, width: "8.333333333333334%"}}><Text></Text></View>
          <View style={{...styles.cell, width: "8.333333333333334%"}}><Text></Text></View>
          <View style={{...styles.cell, width: "8.333333333333334%"}}><Text></Text></View>
          <View style={{...styles.cell, width: "8.333333333333334%"}}><Text></Text></View>
          <View style={{...styles.cell, width: "8.333333333333334%"}}><Text></Text></View>
        </View>
        <View style={styles.row}>
          <View style={{...styles.cell, width: "8.333333333333334%"}}><Text>Female</Text></View>
          <View style={{...styles.cell, width: "8.333333333333334%"}}><Text></Text></View>
          <View style={{...styles.cell, width: "8.333333333333334%"}}><Text></Text></View>
          <View style={{...styles.cell, width: "8.333333333333334%"}}><Text></Text></View>
          <View style={{...styles.cell, width: "8.333333333333334%"}}><Text></Text></View>
          <View style={{...styles.cell, width: "8.333333333333334%"}}><Text></Text></View>
          <View style={{...styles.cell, width: "8.333333333333334%"}}><Text></Text></View>
          <View style={{...styles.cell, width: "8.333333333333334%"}}><Text></Text></View>
          <View style={{...styles.cell, width: "8.333333333333334%"}}><Text></Text></View>
          <View style={{...styles.cell, width: "8.333333333333334%"}}><Text></Text></View>
          <View style={{...styles.cell, width: "8.333333333333334%"}}><Text></Text></View>
          <View style={{...styles.cell, width: "8.333333333333334%"}}><Text></Text></View>
        </View>
        <View style={styles.row}>
          <View style={{...styles.cell, width: "8.333333333333334%"}}><Text>Total</Text></View>
          <View style={{...styles.cell, width: "8.333333333333334%"}}><Text></Text></View>
          <View style={{...styles.cell, width: "8.333333333333334%"}}><Text></Text></View>
          <View style={{...styles.cell, width: "8.333333333333334%"}}><Text></Text></View>
          <View style={{...styles.cell, width: "8.333333333333334%"}}><Text></Text></View>
          <View style={{...styles.cell, width: "8.333333333333334%"}}><Text></Text></View>
          <View style={{...styles.cell, width: "8.333333333333334%"}}><Text></Text></View>
          <View style={{...styles.cell, width: "8.333333333333334%"}}><Text></Text></View>
          <View style={{...styles.cell, width: "8.333333333333334%"}}><Text></Text></View>
          <View style={{...styles.cell, width: "8.333333333333334%"}}><Text></Text></View>
          <View style={{...styles.cell, width: "8.333333333333334%"}}><Text></Text></View>
          <View style={{...styles.cell, width: "8.333333333333334%"}}><Text></Text></View>
        </View>
        <View style={styles.row}>
          <View style={{...styles.cell, width: "8.333333333333334%"}}><Text></Text></View>
          <View style={{...styles.cell, width: "8.333333333333334%"}}><Text></Text></View>
          <View style={{...styles.cell, width: "8.333333333333334%"}}><Text></Text></View>
          <View style={{...styles.cell, width: "8.333333333333334%"}}><Text></Text></View>
          <View style={{...styles.cell, width: "8.333333333333334%"}}><Text></Text></View>
          <View style={{...styles.cell, width: "8.333333333333334%"}}><Text></Text></View>
          <View style={{...styles.cell, width: "8.333333333333334%"}}><Text></Text></View>
          <View style={{...styles.cell, width: "8.333333333333334%"}}><Text></Text></View>
          <View style={{...styles.cell, width: "8.333333333333334%"}}><Text></Text></View>
          <View style={{...styles.cell, width: "8.333333333333334%"}}><Text></Text></View>
          <View style={{...styles.cell, width: "8.333333333333334%"}}><Text></Text></View>
          <View style={{...styles.cell, width: "8.333333333333334%"}}><Text></Text></View>
        </View>
        <View style={styles.row}>
          <View style={{...styles.cell, width: "8.333333333333334%"}}><Text>Male</Text></View>
          <View style={{...styles.cell, width: "8.333333333333334%"}}><Text></Text></View>
          <View style={{...styles.cell, width: "8.333333333333334%"}}><Text></Text></View>
          <View style={{...styles.cell, width: "8.333333333333334%"}}><Text></Text></View>
          <View style={{...styles.cell, width: "8.333333333333334%"}}><Text></Text></View>
          <View style={{...styles.cell, width: "8.333333333333334%"}}><Text></Text></View>
          <View style={{...styles.cell, width: "8.333333333333334%"}}><Text></Text></View>
          <View style={{...styles.cell, width: "8.333333333333334%"}}><Text></Text></View>
          <View style={{...styles.cell, width: "8.333333333333334%"}}><Text></Text></View>
          <View style={{...styles.cell, width: "8.333333333333334%"}}><Text></Text></View>
          <View style={{...styles.cell, width: "8.333333333333334%"}}><Text></Text></View>
          <View style={{...styles.cell, width: "8.333333333333334%"}}><Text></Text></View>
        </View>
        <View style={styles.row}>
          <View style={{...styles.cell, width: "8.333333333333334%"}}><Text>Female</Text></View>
          <View style={{...styles.cell, width: "8.333333333333334%"}}><Text></Text></View>
          <View style={{...styles.cell, width: "8.333333333333334%"}}><Text></Text></View>
          <View style={{...styles.cell, width: "8.333333333333334%"}}><Text></Text></View>
          <View style={{...styles.cell, width: "8.333333333333334%"}}><Text></Text></View>
          <View style={{...styles.cell, width: "8.333333333333334%"}}><Text></Text></View>
          <View style={{...styles.cell, width: "8.333333333333334%"}}><Text></Text></View>
          <View style={{...styles.cell, width: "8.333333333333334%"}}><Text></Text></View>
          <View style={{...styles.cell, width: "8.333333333333334%"}}><Text></Text></View>
          <View style={{...styles.cell, width: "8.333333333333334%"}}><Text></Text></View>
          <View style={{...styles.cell, width: "8.333333333333334%"}}><Text></Text></View>
          <View style={{...styles.cell, width: "8.333333333333334%"}}><Text></Text></View>
        </View>
        <View style={styles.row}>
          <View style={{...styles.cell, width: "8.333333333333334%"}}><Text>Total</Text></View>
          <View style={{...styles.cell, width: "8.333333333333334%"}}><Text></Text></View>
          <View style={{...styles.cell, width: "8.333333333333334%"}}><Text></Text></View>
          <View style={{...styles.cell, width: "8.333333333333334%"}}><Text></Text></View>
          <View style={{...styles.cell, width: "8.333333333333334%"}}><Text></Text></View>
          <View style={{...styles.cell, width: "8.333333333333334%"}}><Text></Text></View>
          <View style={{...styles.cell, width: "8.333333333333334%"}}><Text></Text></View>
          <View style={{...styles.cell, width: "8.333333333333334%"}}><Text></Text></View>
          <View style={{...styles.cell, width: "8.333333333333334%"}}><Text></Text></View>
          <View style={{...styles.cell, width: "8.333333333333334%"}}><Text></Text></View>
          <View style={{...styles.cell, width: "8.333333333333334%"}}><Text></Text></View>
          <View style={{...styles.cell, width: "8.333333333333334%"}}><Text></Text></View>
        </View>
      </View>
      <Text style={styles.p}>c. Spending on measures towards well-being of employees and workers (including permanent and other than permanent) in the following format –</Text>
      <View style={styles.table}>
        <View style={styles.row}>
          <View style={{...styles.cell, width: "33.333333333333336%"}}><Text></Text></View>
          <View style={{...styles.cell, width: "33.333333333333336%"}}><Text>FY (2024-25)  Current Financial Year</Text></View>
          <View style={{...styles.cell, width: "33.333333333333336%"}}><Text></Text></View>
        </View>
        <View style={styles.row}>
          <View style={{...styles.cell, width: "33.333333333333336%"}}><Text>Cost incurred on well- being measures as a % of total  revenue  of the company</Text></View>
          <View style={{...styles.cell, width: "33.333333333333336%"}}><Text></Text></View>
          <View style={{...styles.cell, width: "33.333333333333336%"}}><Text></Text></View>
        </View>
      </View>
      <Text style={styles.p}>Details of retirement benefits, for Current FY and Previous Financial Year.</Text>
      <View style={styles.table}>
        <View style={styles.row}>
          <View style={{...styles.cell, width: "14.285714285714286%"}}><Text>Benefits</Text></View>
          <View style={{...styles.cell, width: "14.285714285714286%"}}><Text></Text></View>
          <View style={{...styles.cell, width: "14.285714285714286%"}}><Text></Text></View>
          <View style={{...styles.cell, width: "14.285714285714286%"}}><Text></Text></View>
          <View style={{...styles.cell, width: "14.285714285714286%"}}><Text></Text></View>
          <View style={{...styles.cell, width: "14.285714285714286%"}}><Text></Text></View>
          <View style={{...styles.cell, width: "14.285714285714286%"}}><Text></Text></View>
        </View>
        <View style={styles.row}>
          <View style={{...styles.cell, width: "14.285714285714286%"}}><Text>Benefits</Text></View>
          <View style={{...styles.cell, width: "14.285714285714286%"}}><Text>No. of employees covered as a  % of  total employees</Text></View>
          <View style={{...styles.cell, width: "14.285714285714286%"}}><Text></Text></View>
          <View style={{...styles.cell, width: "14.285714285714286%"}}><Text></Text></View>
          <View style={{...styles.cell, width: "14.285714285714286%"}}><Text></Text></View>
          <View style={{...styles.cell, width: "14.285714285714286%"}}><Text></Text></View>
          <View style={{...styles.cell, width: "14.285714285714286%"}}><Text></Text></View>
        </View>
        <View style={styles.row}>
          <View style={{...styles.cell, width: "14.285714285714286%"}}><Text>PF</Text></View>
          <View style={{...styles.cell, width: "14.285714285714286%"}}><Text></Text></View>
          <View style={{...styles.cell, width: "14.285714285714286%"}}><Text></Text></View>
          <View style={{...styles.cell, width: "14.285714285714286%"}}><Text></Text></View>
          <View style={{...styles.cell, width: "14.285714285714286%"}}><Text></Text></View>
          <View style={{...styles.cell, width: "14.285714285714286%"}}><Text></Text></View>
          <View style={{...styles.cell, width: "14.285714285714286%"}}><Text></Text></View>
        </View>
        <View style={styles.row}>
          <View style={{...styles.cell, width: "14.285714285714286%"}}><Text>Gratuity</Text></View>
          <View style={{...styles.cell, width: "14.285714285714286%"}}><Text></Text></View>
          <View style={{...styles.cell, width: "14.285714285714286%"}}><Text></Text></View>
          <View style={{...styles.cell, width: "14.285714285714286%"}}><Text></Text></View>
          <View style={{...styles.cell, width: "14.285714285714286%"}}><Text></Text></View>
          <View style={{...styles.cell, width: "14.285714285714286%"}}><Text></Text></View>
          <View style={{...styles.cell, width: "14.285714285714286%"}}><Text></Text></View>
        </View>
        <View style={styles.row}>
          <View style={{...styles.cell, width: "14.285714285714286%"}}><Text>ESI</Text></View>
          <View style={{...styles.cell, width: "14.285714285714286%"}}><Text></Text></View>
          <View style={{...styles.cell, width: "14.285714285714286%"}}><Text></Text></View>
          <View style={{...styles.cell, width: "14.285714285714286%"}}><Text></Text></View>
          <View style={{...styles.cell, width: "14.285714285714286%"}}><Text></Text></View>
          <View style={{...styles.cell, width: "14.285714285714286%"}}><Text></Text></View>
          <View style={{...styles.cell, width: "14.285714285714286%"}}><Text></Text></View>
        </View>
        <View style={styles.row}>
          <View style={{...styles.cell, width: "14.285714285714286%"}}><Text>Others – please  specify</Text></View>
          <View style={{...styles.cell, width: "14.285714285714286%"}}><Text></Text></View>
          <View style={{...styles.cell, width: "14.285714285714286%"}}><Text></Text></View>
          <View style={{...styles.cell, width: "14.285714285714286%"}}><Text></Text></View>
          <View style={{...styles.cell, width: "14.285714285714286%"}}><Text></Text></View>
          <View style={{...styles.cell, width: "14.285714285714286%"}}><Text></Text></View>
          <View style={{...styles.cell, width: "14.285714285714286%"}}><Text></Text></View>
        </View>
      </View>
      <Text style={styles.p}>Accessibility of workplaces</Text>
      <Text style={styles.p}>Are the premises / offices of the entity accessible to differently abled employees and workers, as per the requirements of the Rights of Persons with Disabilities Act, 2016? If not, whether any steps are being taken by the entity in this regard.</Text>
      <Text style={styles.p}>Yes, workplace is accessible to differently abled employees.</Text>
      <Text style={styles.p}>Does the entity have an equal opportunity policy as per the Rights of Persons with Disabilities Act, 2016? If so, provide a web-link to the policy.</Text>
      <Text style={styles.p}>The Company’s Code of Conduct envelopes the Equal Opportunity Policy, the entity does not have a separate policy. The code of conduct encourages employees to treat everyone fairly, equally and without discrimination.</Text>
      <Text style={styles.p}>Return to work and Retention rates of permanent employees and workers that took parental leave.</Text>
      <View style={styles.table}>
        <View style={styles.row}>
          <View style={{...styles.cell, width: "20.0%"}}><Text></Text></View>
          <View style={{...styles.cell, width: "20.0%"}}><Text></Text></View>
          <View style={{...styles.cell, width: "20.0%"}}><Text></Text></View>
          <View style={{...styles.cell, width: "20.0%"}}><Text></Text></View>
          <View style={{...styles.cell, width: "20.0%"}}><Text></Text></View>
        </View>
        <View style={styles.row}>
          <View style={{...styles.cell, width: "20.0%"}}><Text>Gender</Text></View>
          <View style={{...styles.cell, width: "20.0%"}}><Text>Return to work rate</Text></View>
          <View style={{...styles.cell, width: "20.0%"}}><Text></Text></View>
          <View style={{...styles.cell, width: "20.0%"}}><Text></Text></View>
          <View style={{...styles.cell, width: "20.0%"}}><Text></Text></View>
        </View>
        <View style={styles.row}>
          <View style={{...styles.cell, width: "20.0%"}}><Text>Male</Text></View>
          <View style={{...styles.cell, width: "20.0%"}}><Text></Text></View>
          <View style={{...styles.cell, width: "20.0%"}}><Text></Text></View>
          <View style={{...styles.cell, width: "20.0%"}}><Text></Text></View>
          <View style={{...styles.cell, width: "20.0%"}}><Text></Text></View>
        </View>
        <View style={styles.row}>
          <View style={{...styles.cell, width: "20.0%"}}><Text>Female</Text></View>
          <View style={{...styles.cell, width: "20.0%"}}><Text></Text></View>
          <View style={{...styles.cell, width: "20.0%"}}><Text></Text></View>
          <View style={{...styles.cell, width: "20.0%"}}><Text></Text></View>
          <View style={{...styles.cell, width: "20.0%"}}><Text></Text></View>
        </View>
        <View style={styles.row}>
          <View style={{...styles.cell, width: "20.0%"}}><Text>Total</Text></View>
          <View style={{...styles.cell, width: "20.0%"}}><Text></Text></View>
          <View style={{...styles.cell, width: "20.0%"}}><Text></Text></View>
          <View style={{...styles.cell, width: "20.0%"}}><Text></Text></View>
          <View style={{...styles.cell, width: "20.0%"}}><Text></Text></View>
        </View>
      </View>
      <Text style={styles.p}>Is there a mechanism available to receive and redress grievances for the following categories of employees and worker? If yes, give details of the mechanism in brief.</Text>
      <View style={styles.table}>
        <View style={styles.row}>
          <View style={{...styles.cell, width: "50.0%"}}><Text></Text></View>
          <View style={{...styles.cell, width: "50.0%"}}><Text>Yes/No  (If Yes, then give details of the mechanism in brief)</Text></View>
        </View>
        <View style={styles.row}>
          <View style={{...styles.cell, width: "50.0%"}}><Text>Permanent Workers</Text></View>
          <View style={{...styles.cell, width: "50.0%"}}><Text>Yes, Any grievances of employees and workers has been dealt in accordance with the Grievance Redressal Policy of the Company. Additionally, any stakeholder can report their genuine whistle blower related concerns and grievances to the Whistle Blower Review Committee.  In the event such complaint concerning any director then any stakeholder may directly report to the Chairperson of the Audit Committee.</Text></View>
        </View>
        <View style={styles.row}>
          <View style={{...styles.cell, width: "50.0%"}}><Text>Other than Permanent Workers</Text></View>
          <View style={{...styles.cell, width: "50.0%"}}><Text>Yes, Any grievances of employees and workers has been dealt in accordance with the Grievance Redressal Policy of the Company. Additionally, any stakeholder can report their genuine whistle blower related concerns and grievances to the Whistle Blower Review Committee.  In the event such complaint concerning any director then any stakeholder may directly report to the Chairperson of the Audit Committee.</Text></View>
        </View>
        <View style={styles.row}>
          <View style={{...styles.cell, width: "50.0%"}}><Text>Permanent Employees</Text></View>
          <View style={{...styles.cell, width: "50.0%"}}><Text>Yes, Any grievances of employees and workers has been dealt in accordance with the Grievance Redressal Policy of the Company. Additionally, any stakeholder can report their genuine whistle blower related concerns and grievances to the Whistle Blower Review Committee.  In the event such complaint concerning any director then any stakeholder may directly report to the Chairperson of the Audit Committee.</Text></View>
        </View>
        <View style={styles.row}>
          <View style={{...styles.cell, width: "50.0%"}}><Text>Other than Permanent Employees</Text></View>
          <View style={{...styles.cell, width: "50.0%"}}><Text>Yes, Any grievances of employees and workers has been dealt in accordance with the Grievance Redressal Policy of the Company. Additionally, any stakeholder can report their genuine whistle blower related concerns and grievances to the Whistle Blower Review Committee.  In the event such complaint concerning any director then any stakeholder may directly report to the Chairperson of the Audit Committee.</Text></View>
        </View>
      </View>
      <Text style={styles.p}>Membership of employees and worker in association(s) or Unions recognised by the listed entity:</Text>
      <View style={styles.table}>
        <View style={styles.row}>
          <View style={{...styles.cell, width: "14.285714285714286%"}}><Text>Category</Text></View>
          <View style={{...styles.cell, width: "14.285714285714286%"}}><Text></Text></View>
          <View style={{...styles.cell, width: "14.285714285714286%"}}><Text></Text></View>
          <View style={{...styles.cell, width: "14.285714285714286%"}}><Text></Text></View>
          <View style={{...styles.cell, width: "14.285714285714286%"}}><Text></Text></View>
          <View style={{...styles.cell, width: "14.285714285714286%"}}><Text></Text></View>
          <View style={{...styles.cell, width: "14.285714285714286%"}}><Text></Text></View>
        </View>
        <View style={styles.row}>
          <View style={{...styles.cell, width: "14.285714285714286%"}}><Text>Category</Text></View>
          <View style={{...styles.cell, width: "14.285714285714286%"}}><Text>Total employees / workers	in respective category  (A)</Text></View>
          <View style={{...styles.cell, width: "14.285714285714286%"}}><Text></Text></View>
          <View style={{...styles.cell, width: "14.285714285714286%"}}><Text></Text></View>
          <View style={{...styles.cell, width: "14.285714285714286%"}}><Text></Text></View>
          <View style={{...styles.cell, width: "14.285714285714286%"}}><Text></Text></View>
          <View style={{...styles.cell, width: "14.285714285714286%"}}><Text></Text></View>
        </View>
        <View style={styles.row}>
          <View style={{...styles.cell, width: "14.285714285714286%"}}><Text>Total Permannt Employes</Text></View>
          <View style={{...styles.cell, width: "14.285714285714286%"}}><Text></Text></View>
          <View style={{...styles.cell, width: "14.285714285714286%"}}><Text></Text></View>
          <View style={{...styles.cell, width: "14.285714285714286%"}}><Text></Text></View>
          <View style={{...styles.cell, width: "14.285714285714286%"}}><Text></Text></View>
          <View style={{...styles.cell, width: "14.285714285714286%"}}><Text></Text></View>
          <View style={{...styles.cell, width: "14.285714285714286%"}}><Text></Text></View>
        </View>
        <View style={styles.row}>
          <View style={{...styles.cell, width: "14.285714285714286%"}}><Text>-	Male</Text></View>
          <View style={{...styles.cell, width: "14.285714285714286%"}}><Text></Text></View>
          <View style={{...styles.cell, width: "14.285714285714286%"}}><Text></Text></View>
          <View style={{...styles.cell, width: "14.285714285714286%"}}><Text></Text></View>
          <View style={{...styles.cell, width: "14.285714285714286%"}}><Text></Text></View>
          <View style={{...styles.cell, width: "14.285714285714286%"}}><Text></Text></View>
          <View style={{...styles.cell, width: "14.285714285714286%"}}><Text></Text></View>
        </View>
        <View style={styles.row}>
          <View style={{...styles.cell, width: "14.285714285714286%"}}><Text>-	Female</Text></View>
          <View style={{...styles.cell, width: "14.285714285714286%"}}><Text></Text></View>
          <View style={{...styles.cell, width: "14.285714285714286%"}}><Text></Text></View>
          <View style={{...styles.cell, width: "14.285714285714286%"}}><Text></Text></View>
          <View style={{...styles.cell, width: "14.285714285714286%"}}><Text></Text></View>
          <View style={{...styles.cell, width: "14.285714285714286%"}}><Text></Text></View>
          <View style={{...styles.cell, width: "14.285714285714286%"}}><Text></Text></View>
        </View>
        <View style={styles.row}>
          <View style={{...styles.cell, width: "14.285714285714286%"}}><Text>Total Permanent Workers</Text></View>
          <View style={{...styles.cell, width: "14.285714285714286%"}}><Text></Text></View>
          <View style={{...styles.cell, width: "14.285714285714286%"}}><Text></Text></View>
          <View style={{...styles.cell, width: "14.285714285714286%"}}><Text></Text></View>
          <View style={{...styles.cell, width: "14.285714285714286%"}}><Text></Text></View>
          <View style={{...styles.cell, width: "14.285714285714286%"}}><Text></Text></View>
          <View style={{...styles.cell, width: "14.285714285714286%"}}><Text></Text></View>
        </View>
        <View style={styles.row}>
          <View style={{...styles.cell, width: "14.285714285714286%"}}><Text>-	Male</Text></View>
          <View style={{...styles.cell, width: "14.285714285714286%"}}><Text></Text></View>
          <View style={{...styles.cell, width: "14.285714285714286%"}}><Text></Text></View>
          <View style={{...styles.cell, width: "14.285714285714286%"}}><Text></Text></View>
          <View style={{...styles.cell, width: "14.285714285714286%"}}><Text></Text></View>
          <View style={{...styles.cell, width: "14.285714285714286%"}}><Text></Text></View>
          <View style={{...styles.cell, width: "14.285714285714286%"}}><Text></Text></View>
        </View>
        <View style={styles.row}>
          <View style={{...styles.cell, width: "14.285714285714286%"}}><Text>-	Female</Text></View>
          <View style={{...styles.cell, width: "14.285714285714286%"}}><Text></Text></View>
          <View style={{...styles.cell, width: "14.285714285714286%"}}><Text></Text></View>
          <View style={{...styles.cell, width: "14.285714285714286%"}}><Text></Text></View>
          <View style={{...styles.cell, width: "14.285714285714286%"}}><Text></Text></View>
          <View style={{...styles.cell, width: "14.285714285714286%"}}><Text></Text></View>
          <View style={{...styles.cell, width: "14.285714285714286%"}}><Text></Text></View>
        </View>
      </View>
      <Text style={styles.p}>Details of training given to employees and workers:</Text>
      <View style={styles.table}>
        <View style={styles.row}>
          <View style={{...styles.cell, width: "9.090909090909092%"}}><Text>Category</Text></View>
          <View style={{...styles.cell, width: "9.090909090909092%"}}><Text></Text></View>
          <View style={{...styles.cell, width: "9.090909090909092%"}}><Text></Text></View>
          <View style={{...styles.cell, width: "9.090909090909092%"}}><Text></Text></View>
          <View style={{...styles.cell, width: "9.090909090909092%"}}><Text></Text></View>
          <View style={{...styles.cell, width: "9.090909090909092%"}}><Text></Text></View>
          <View style={{...styles.cell, width: "9.090909090909092%"}}><Text></Text></View>
          <View style={{...styles.cell, width: "9.090909090909092%"}}><Text></Text></View>
          <View style={{...styles.cell, width: "9.090909090909092%"}}><Text></Text></View>
          <View style={{...styles.cell, width: "9.090909090909092%"}}><Text></Text></View>
          <View style={{...styles.cell, width: "9.090909090909092%"}}><Text></Text></View>
        </View>
        <View style={styles.row}>
          <View style={{...styles.cell, width: "9.090909090909092%"}}><Text>Category</Text></View>
          <View style={{...styles.cell, width: "9.090909090909092%"}}><Text>Total (A)</Text></View>
          <View style={{...styles.cell, width: "9.090909090909092%"}}><Text></Text></View>
          <View style={{...styles.cell, width: "9.090909090909092%"}}><Text></Text></View>
          <View style={{...styles.cell, width: "9.090909090909092%"}}><Text></Text></View>
          <View style={{...styles.cell, width: "9.090909090909092%"}}><Text></Text></View>
          <View style={{...styles.cell, width: "9.090909090909092%"}}><Text></Text></View>
          <View style={{...styles.cell, width: "9.090909090909092%"}}><Text></Text></View>
          <View style={{...styles.cell, width: "9.090909090909092%"}}><Text></Text></View>
          <View style={{...styles.cell, width: "9.090909090909092%"}}><Text></Text></View>
          <View style={{...styles.cell, width: "9.090909090909092%"}}><Text></Text></View>
        </View>
        <View style={styles.row}>
          <View style={{...styles.cell, width: "9.090909090909092%"}}><Text>Category</Text></View>
          <View style={{...styles.cell, width: "9.090909090909092%"}}><Text>Total (A)</Text></View>
          <View style={{...styles.cell, width: "9.090909090909092%"}}><Text></Text></View>
          <View style={{...styles.cell, width: "9.090909090909092%"}}><Text></Text></View>
          <View style={{...styles.cell, width: "9.090909090909092%"}}><Text></Text></View>
          <View style={{...styles.cell, width: "9.090909090909092%"}}><Text></Text></View>
          <View style={{...styles.cell, width: "9.090909090909092%"}}><Text></Text></View>
          <View style={{...styles.cell, width: "9.090909090909092%"}}><Text></Text></View>
          <View style={{...styles.cell, width: "9.090909090909092%"}}><Text></Text></View>
          <View style={{...styles.cell, width: "9.090909090909092%"}}><Text></Text></View>
          <View style={{...styles.cell, width: "9.090909090909092%"}}><Text></Text></View>
        </View>
        <View style={styles.row}>
          <View style={{...styles.cell, width: "9.090909090909092%"}}><Text></Text></View>
          <View style={{...styles.cell, width: "9.090909090909092%"}}><Text></Text></View>
          <View style={{...styles.cell, width: "9.090909090909092%"}}><Text></Text></View>
          <View style={{...styles.cell, width: "9.090909090909092%"}}><Text></Text></View>
          <View style={{...styles.cell, width: "9.090909090909092%"}}><Text></Text></View>
          <View style={{...styles.cell, width: "9.090909090909092%"}}><Text></Text></View>
          <View style={{...styles.cell, width: "9.090909090909092%"}}><Text></Text></View>
          <View style={{...styles.cell, width: "9.090909090909092%"}}><Text></Text></View>
          <View style={{...styles.cell, width: "9.090909090909092%"}}><Text></Text></View>
          <View style={{...styles.cell, width: "9.090909090909092%"}}><Text></Text></View>
          <View style={{...styles.cell, width: "9.090909090909092%"}}><Text></Text></View>
        </View>
        <View style={styles.row}>
          <View style={{...styles.cell, width: "9.090909090909092%"}}><Text>Male</Text></View>
          <View style={{...styles.cell, width: "9.090909090909092%"}}><Text>554</Text></View>
          <View style={{...styles.cell, width: "9.090909090909092%"}}><Text></Text></View>
          <View style={{...styles.cell, width: "9.090909090909092%"}}><Text></Text></View>
          <View style={{...styles.cell, width: "9.090909090909092%"}}><Text></Text></View>
          <View style={{...styles.cell, width: "9.090909090909092%"}}><Text></Text></View>
          <View style={{...styles.cell, width: "9.090909090909092%"}}><Text></Text></View>
          <View style={{...styles.cell, width: "9.090909090909092%"}}><Text></Text></View>
          <View style={{...styles.cell, width: "9.090909090909092%"}}><Text></Text></View>
          <View style={{...styles.cell, width: "9.090909090909092%"}}><Text></Text></View>
          <View style={{...styles.cell, width: "9.090909090909092%"}}><Text></Text></View>
        </View>
        <View style={styles.row}>
          <View style={{...styles.cell, width: "9.090909090909092%"}}><Text>Female</Text></View>
          <View style={{...styles.cell, width: "9.090909090909092%"}}><Text>26</Text></View>
          <View style={{...styles.cell, width: "9.090909090909092%"}}><Text></Text></View>
          <View style={{...styles.cell, width: "9.090909090909092%"}}><Text></Text></View>
          <View style={{...styles.cell, width: "9.090909090909092%"}}><Text></Text></View>
          <View style={{...styles.cell, width: "9.090909090909092%"}}><Text></Text></View>
          <View style={{...styles.cell, width: "9.090909090909092%"}}><Text></Text></View>
          <View style={{...styles.cell, width: "9.090909090909092%"}}><Text></Text></View>
          <View style={{...styles.cell, width: "9.090909090909092%"}}><Text></Text></View>
          <View style={{...styles.cell, width: "9.090909090909092%"}}><Text></Text></View>
          <View style={{...styles.cell, width: "9.090909090909092%"}}><Text></Text></View>
        </View>
        <View style={styles.row}>
          <View style={{...styles.cell, width: "9.090909090909092%"}}><Text>Total</Text></View>
          <View style={{...styles.cell, width: "9.090909090909092%"}}><Text>580</Text></View>
          <View style={{...styles.cell, width: "9.090909090909092%"}}><Text></Text></View>
          <View style={{...styles.cell, width: "9.090909090909092%"}}><Text></Text></View>
          <View style={{...styles.cell, width: "9.090909090909092%"}}><Text></Text></View>
          <View style={{...styles.cell, width: "9.090909090909092%"}}><Text></Text></View>
          <View style={{...styles.cell, width: "9.090909090909092%"}}><Text></Text></View>
          <View style={{...styles.cell, width: "9.090909090909092%"}}><Text></Text></View>
          <View style={{...styles.cell, width: "9.090909090909092%"}}><Text></Text></View>
          <View style={{...styles.cell, width: "9.090909090909092%"}}><Text></Text></View>
          <View style={{...styles.cell, width: "9.090909090909092%"}}><Text></Text></View>
        </View>
        <View style={styles.row}>
          <View style={{...styles.cell, width: "9.090909090909092%"}}><Text></Text></View>
          <View style={{...styles.cell, width: "9.090909090909092%"}}><Text></Text></View>
          <View style={{...styles.cell, width: "9.090909090909092%"}}><Text></Text></View>
          <View style={{...styles.cell, width: "9.090909090909092%"}}><Text></Text></View>
          <View style={{...styles.cell, width: "9.090909090909092%"}}><Text></Text></View>
          <View style={{...styles.cell, width: "9.090909090909092%"}}><Text></Text></View>
          <View style={{...styles.cell, width: "9.090909090909092%"}}><Text></Text></View>
          <View style={{...styles.cell, width: "9.090909090909092%"}}><Text></Text></View>
          <View style={{...styles.cell, width: "9.090909090909092%"}}><Text></Text></View>
          <View style={{...styles.cell, width: "9.090909090909092%"}}><Text></Text></View>
          <View style={{...styles.cell, width: "9.090909090909092%"}}><Text></Text></View>
        </View>
        <View style={styles.row}>
          <View style={{...styles.cell, width: "9.090909090909092%"}}><Text>Male</Text></View>
          <View style={{...styles.cell, width: "9.090909090909092%"}}><Text>2591</Text></View>
          <View style={{...styles.cell, width: "9.090909090909092%"}}><Text></Text></View>
          <View style={{...styles.cell, width: "9.090909090909092%"}}><Text></Text></View>
          <View style={{...styles.cell, width: "9.090909090909092%"}}><Text></Text></View>
          <View style={{...styles.cell, width: "9.090909090909092%"}}><Text></Text></View>
          <View style={{...styles.cell, width: "9.090909090909092%"}}><Text></Text></View>
          <View style={{...styles.cell, width: "9.090909090909092%"}}><Text></Text></View>
          <View style={{...styles.cell, width: "9.090909090909092%"}}><Text></Text></View>
          <View style={{...styles.cell, width: "9.090909090909092%"}}><Text></Text></View>
          <View style={{...styles.cell, width: "9.090909090909092%"}}><Text></Text></View>
        </View>
        <View style={styles.row}>
          <View style={{...styles.cell, width: "9.090909090909092%"}}><Text>Female</Text></View>
          <View style={{...styles.cell, width: "9.090909090909092%"}}><Text>89</Text></View>
          <View style={{...styles.cell, width: "9.090909090909092%"}}><Text></Text></View>
          <View style={{...styles.cell, width: "9.090909090909092%"}}><Text></Text></View>
          <View style={{...styles.cell, width: "9.090909090909092%"}}><Text></Text></View>
          <View style={{...styles.cell, width: "9.090909090909092%"}}><Text></Text></View>
          <View style={{...styles.cell, width: "9.090909090909092%"}}><Text></Text></View>
          <View style={{...styles.cell, width: "9.090909090909092%"}}><Text></Text></View>
          <View style={{...styles.cell, width: "9.090909090909092%"}}><Text></Text></View>
          <View style={{...styles.cell, width: "9.090909090909092%"}}><Text></Text></View>
          <View style={{...styles.cell, width: "9.090909090909092%"}}><Text></Text></View>
        </View>
        <View style={styles.row}>
          <View style={{...styles.cell, width: "9.090909090909092%"}}><Text>Total</Text></View>
          <View style={{...styles.cell, width: "9.090909090909092%"}}><Text>2680</Text></View>
          <View style={{...styles.cell, width: "9.090909090909092%"}}><Text></Text></View>
          <View style={{...styles.cell, width: "9.090909090909092%"}}><Text></Text></View>
          <View style={{...styles.cell, width: "9.090909090909092%"}}><Text></Text></View>
          <View style={{...styles.cell, width: "9.090909090909092%"}}><Text></Text></View>
          <View style={{...styles.cell, width: "9.090909090909092%"}}><Text></Text></View>
          <View style={{...styles.cell, width: "9.090909090909092%"}}><Text></Text></View>
          <View style={{...styles.cell, width: "9.090909090909092%"}}><Text></Text></View>
          <View style={{...styles.cell, width: "9.090909090909092%"}}><Text></Text></View>
          <View style={{...styles.cell, width: "9.090909090909092%"}}><Text></Text></View>
        </View>
      </View>
      <Text style={styles.p}>Details of performance and career development reviews of employees and worker:</Text>
      <View style={styles.table}>
        <View style={styles.row}>
          <View style={{...styles.cell, width: "14.285714285714286%"}}><Text>Category</Text></View>
          <View style={{...styles.cell, width: "14.285714285714286%"}}><Text></Text></View>
          <View style={{...styles.cell, width: "14.285714285714286%"}}><Text></Text></View>
          <View style={{...styles.cell, width: "14.285714285714286%"}}><Text></Text></View>
          <View style={{...styles.cell, width: "14.285714285714286%"}}><Text></Text></View>
          <View style={{...styles.cell, width: "14.285714285714286%"}}><Text></Text></View>
          <View style={{...styles.cell, width: "14.285714285714286%"}}><Text></Text></View>
        </View>
        <View style={styles.row}>
          <View style={{...styles.cell, width: "14.285714285714286%"}}><Text>Category</Text></View>
          <View style={{...styles.cell, width: "14.285714285714286%"}}><Text>Total (A)</Text></View>
          <View style={{...styles.cell, width: "14.285714285714286%"}}><Text></Text></View>
          <View style={{...styles.cell, width: "14.285714285714286%"}}><Text></Text></View>
          <View style={{...styles.cell, width: "14.285714285714286%"}}><Text></Text></View>
          <View style={{...styles.cell, width: "14.285714285714286%"}}><Text></Text></View>
          <View style={{...styles.cell, width: "14.285714285714286%"}}><Text></Text></View>
        </View>
        <View style={styles.row}>
          <View style={{...styles.cell, width: "14.285714285714286%"}}><Text></Text></View>
          <View style={{...styles.cell, width: "14.285714285714286%"}}><Text></Text></View>
          <View style={{...styles.cell, width: "14.285714285714286%"}}><Text></Text></View>
          <View style={{...styles.cell, width: "14.285714285714286%"}}><Text></Text></View>
          <View style={{...styles.cell, width: "14.285714285714286%"}}><Text></Text></View>
          <View style={{...styles.cell, width: "14.285714285714286%"}}><Text></Text></View>
          <View style={{...styles.cell, width: "14.285714285714286%"}}><Text></Text></View>
        </View>
        <View style={styles.row}>
          <View style={{...styles.cell, width: "14.285714285714286%"}}><Text>Male</Text></View>
          <View style={{...styles.cell, width: "14.285714285714286%"}}><Text>554</Text></View>
          <View style={{...styles.cell, width: "14.285714285714286%"}}><Text></Text></View>
          <View style={{...styles.cell, width: "14.285714285714286%"}}><Text></Text></View>
          <View style={{...styles.cell, width: "14.285714285714286%"}}><Text></Text></View>
          <View style={{...styles.cell, width: "14.285714285714286%"}}><Text></Text></View>
          <View style={{...styles.cell, width: "14.285714285714286%"}}><Text></Text></View>
        </View>
        <View style={styles.row}>
          <View style={{...styles.cell, width: "14.285714285714286%"}}><Text>Female</Text></View>
          <View style={{...styles.cell, width: "14.285714285714286%"}}><Text>26</Text></View>
          <View style={{...styles.cell, width: "14.285714285714286%"}}><Text></Text></View>
          <View style={{...styles.cell, width: "14.285714285714286%"}}><Text></Text></View>
          <View style={{...styles.cell, width: "14.285714285714286%"}}><Text></Text></View>
          <View style={{...styles.cell, width: "14.285714285714286%"}}><Text></Text></View>
          <View style={{...styles.cell, width: "14.285714285714286%"}}><Text></Text></View>
        </View>
        <View style={styles.row}>
          <View style={{...styles.cell, width: "14.285714285714286%"}}><Text>Total</Text></View>
          <View style={{...styles.cell, width: "14.285714285714286%"}}><Text>580</Text></View>
          <View style={{...styles.cell, width: "14.285714285714286%"}}><Text></Text></View>
          <View style={{...styles.cell, width: "14.285714285714286%"}}><Text></Text></View>
          <View style={{...styles.cell, width: "14.285714285714286%"}}><Text></Text></View>
          <View style={{...styles.cell, width: "14.285714285714286%"}}><Text></Text></View>
          <View style={{...styles.cell, width: "14.285714285714286%"}}><Text></Text></View>
        </View>
        <View style={styles.row}>
          <View style={{...styles.cell, width: "14.285714285714286%"}}><Text></Text></View>
          <View style={{...styles.cell, width: "14.285714285714286%"}}><Text></Text></View>
          <View style={{...styles.cell, width: "14.285714285714286%"}}><Text></Text></View>
          <View style={{...styles.cell, width: "14.285714285714286%"}}><Text></Text></View>
          <View style={{...styles.cell, width: "14.285714285714286%"}}><Text></Text></View>
          <View style={{...styles.cell, width: "14.285714285714286%"}}><Text></Text></View>
          <View style={{...styles.cell, width: "14.285714285714286%"}}><Text></Text></View>
        </View>
        <View style={styles.row}>
          <View style={{...styles.cell, width: "14.285714285714286%"}}><Text>Male</Text></View>
          <View style={{...styles.cell, width: "14.285714285714286%"}}><Text>2591</Text></View>
          <View style={{...styles.cell, width: "14.285714285714286%"}}><Text></Text></View>
          <View style={{...styles.cell, width: "14.285714285714286%"}}><Text></Text></View>
          <View style={{...styles.cell, width: "14.285714285714286%"}}><Text></Text></View>
          <View style={{...styles.cell, width: "14.285714285714286%"}}><Text></Text></View>
          <View style={{...styles.cell, width: "14.285714285714286%"}}><Text></Text></View>
        </View>
        <View style={styles.row}>
          <View style={{...styles.cell, width: "14.285714285714286%"}}><Text>Female</Text></View>
          <View style={{...styles.cell, width: "14.285714285714286%"}}><Text>89</Text></View>
          <View style={{...styles.cell, width: "14.285714285714286%"}}><Text></Text></View>
          <View style={{...styles.cell, width: "14.285714285714286%"}}><Text></Text></View>
          <View style={{...styles.cell, width: "14.285714285714286%"}}><Text></Text></View>
          <View style={{...styles.cell, width: "14.285714285714286%"}}><Text></Text></View>
          <View style={{...styles.cell, width: "14.285714285714286%"}}><Text></Text></View>
        </View>
        <View style={styles.row}>
          <View style={{...styles.cell, width: "14.285714285714286%"}}><Text>Total</Text></View>
          <View style={{...styles.cell, width: "14.285714285714286%"}}><Text>2680</Text></View>
          <View style={{...styles.cell, width: "14.285714285714286%"}}><Text></Text></View>
          <View style={{...styles.cell, width: "14.285714285714286%"}}><Text></Text></View>
          <View style={{...styles.cell, width: "14.285714285714286%"}}><Text></Text></View>
          <View style={{...styles.cell, width: "14.285714285714286%"}}><Text></Text></View>
          <View style={{...styles.cell, width: "14.285714285714286%"}}><Text></Text></View>
        </View>
      </View>
      <Text style={styles.p}>Health and safety management system:</Text>
      <Text style={styles.p}>Whether an occupational health and safety management system has been implemented by the entity? (Yes/ No). If yes, the coverage such system?</Text>
      <Text style={styles.p}>What are the processes used to identify work-related hazards and assess risks on a routine and non-routine basis by the entity?</Text>
      <Text style={styles.p}>Hazard Identification &amp; risk Assessment (HIRA) Used for Quantify Hazard and risk. Also Safety patrolling, JSA and KYT tool used for hazard and risk identification on routine and Non routine basis.</Text>
      <Text style={styles.p}>Whether you have processes for workers to report the work related hazards and to remove themselves from such risks. (Y/N)</Text>
      <Text style={styles.p}>Do the employees/ worker of the entity have access to non-occupational medical and healthcare services? (Yes/ No)</Text>
      <Text style={styles.p}>Details of safety related incidents, in the following format:</Text>
      <View style={styles.table}>
        <View style={styles.row}>
          <View style={{...styles.cell, width: "25.0%"}}><Text>Safety Incident/Number</Text></View>
          <View style={{...styles.cell, width: "25.0%"}}><Text>Category*</Text></View>
          <View style={{...styles.cell, width: "25.0%"}}><Text></Text></View>
          <View style={{...styles.cell, width: "25.0%"}}><Text></Text></View>
        </View>
        <View style={styles.row}>
          <View style={{...styles.cell, width: "25.0%"}}><Text>Lost Time Injury Frequency Rate (LTIFR)	(per	one	million-person  hours worked)</Text></View>
          <View style={{...styles.cell, width: "25.0%"}}><Text>Employees</Text></View>
          <View style={{...styles.cell, width: "25.0%"}}><Text></Text></View>
          <View style={{...styles.cell, width: "25.0%"}}><Text></Text></View>
        </View>
        <View style={styles.row}>
          <View style={{...styles.cell, width: "25.0%"}}><Text>Lost Time Injury Frequency Rate (LTIFR)	(per	one	million-person  hours worked)</Text></View>
          <View style={{...styles.cell, width: "25.0%"}}><Text>Workers</Text></View>
          <View style={{...styles.cell, width: "25.0%"}}><Text></Text></View>
          <View style={{...styles.cell, width: "25.0%"}}><Text></Text></View>
        </View>
        <View style={styles.row}>
          <View style={{...styles.cell, width: "25.0%"}}><Text>Total	recordable	work-related injuries</Text></View>
          <View style={{...styles.cell, width: "25.0%"}}><Text>Employees</Text></View>
          <View style={{...styles.cell, width: "25.0%"}}><Text></Text></View>
          <View style={{...styles.cell, width: "25.0%"}}><Text></Text></View>
        </View>
        <View style={styles.row}>
          <View style={{...styles.cell, width: "25.0%"}}><Text>Total	recordable	work-related injuries</Text></View>
          <View style={{...styles.cell, width: "25.0%"}}><Text>Workers</Text></View>
          <View style={{...styles.cell, width: "25.0%"}}><Text></Text></View>
          <View style={{...styles.cell, width: "25.0%"}}><Text></Text></View>
        </View>
        <View style={styles.row}>
          <View style={{...styles.cell, width: "25.0%"}}><Text>No. of fatalities</Text></View>
          <View style={{...styles.cell, width: "25.0%"}}><Text>Employees</Text></View>
          <View style={{...styles.cell, width: "25.0%"}}><Text></Text></View>
          <View style={{...styles.cell, width: "25.0%"}}><Text></Text></View>
        </View>
        <View style={styles.row}>
          <View style={{...styles.cell, width: "25.0%"}}><Text>No. of fatalities</Text></View>
          <View style={{...styles.cell, width: "25.0%"}}><Text>Workers</Text></View>
          <View style={{...styles.cell, width: "25.0%"}}><Text></Text></View>
          <View style={{...styles.cell, width: "25.0%"}}><Text></Text></View>
        </View>
        <View style={styles.row}>
          <View style={{...styles.cell, width: "25.0%"}}><Text>High consequence work-related injury or ill-health (excluding fatalities)</Text></View>
          <View style={{...styles.cell, width: "25.0%"}}><Text>Employees</Text></View>
          <View style={{...styles.cell, width: "25.0%"}}><Text></Text></View>
          <View style={{...styles.cell, width: "25.0%"}}><Text></Text></View>
        </View>
        <View style={styles.row}>
          <View style={{...styles.cell, width: "25.0%"}}><Text>High consequence work-related injury or ill-health (excluding fatalities)</Text></View>
          <View style={{...styles.cell, width: "25.0%"}}><Text>Workers</Text></View>
          <View style={{...styles.cell, width: "25.0%"}}><Text></Text></View>
          <View style={{...styles.cell, width: "25.0%"}}><Text></Text></View>
        </View>
      </View>
      <Text style={styles.p}>*Including in the contract workforce</Text>
      <Text style={styles.p}>Describe the measures taken by the entity to ensure a safe and healthy work place.</Text>
      <Text style={styles.p}>Number of Complaints on the following made by employees and workers:</Text>
      <View style={styles.table}>
        <View style={styles.row}>
          <View style={{...styles.cell, width: "14.285714285714286%"}}><Text></Text></View>
          <View style={{...styles.cell, width: "14.285714285714286%"}}><Text></Text></View>
          <View style={{...styles.cell, width: "14.285714285714286%"}}><Text></Text></View>
          <View style={{...styles.cell, width: "14.285714285714286%"}}><Text></Text></View>
          <View style={{...styles.cell, width: "14.285714285714286%"}}><Text></Text></View>
          <View style={{...styles.cell, width: "14.285714285714286%"}}><Text></Text></View>
          <View style={{...styles.cell, width: "14.285714285714286%"}}><Text></Text></View>
        </View>
        <View style={styles.row}>
          <View style={{...styles.cell, width: "14.285714285714286%"}}><Text></Text></View>
          <View style={{...styles.cell, width: "14.285714285714286%"}}><Text>Filed during the year</Text></View>
          <View style={{...styles.cell, width: "14.285714285714286%"}}><Text></Text></View>
          <View style={{...styles.cell, width: "14.285714285714286%"}}><Text></Text></View>
          <View style={{...styles.cell, width: "14.285714285714286%"}}><Text></Text></View>
          <View style={{...styles.cell, width: "14.285714285714286%"}}><Text></Text></View>
          <View style={{...styles.cell, width: "14.285714285714286%"}}><Text></Text></View>
        </View>
        <View style={styles.row}>
          <View style={{...styles.cell, width: "14.285714285714286%"}}><Text>Working Conditions</Text></View>
          <View style={{...styles.cell, width: "14.285714285714286%"}}><Text></Text></View>
          <View style={{...styles.cell, width: "14.285714285714286%"}}><Text></Text></View>
          <View style={{...styles.cell, width: "14.285714285714286%"}}><Text></Text></View>
          <View style={{...styles.cell, width: "14.285714285714286%"}}><Text></Text></View>
          <View style={{...styles.cell, width: "14.285714285714286%"}}><Text></Text></View>
          <View style={{...styles.cell, width: "14.285714285714286%"}}><Text></Text></View>
        </View>
        <View style={styles.row}>
          <View style={{...styles.cell, width: "14.285714285714286%"}}><Text>Health	&amp; Safety</Text></View>
          <View style={{...styles.cell, width: "14.285714285714286%"}}><Text></Text></View>
          <View style={{...styles.cell, width: "14.285714285714286%"}}><Text></Text></View>
          <View style={{...styles.cell, width: "14.285714285714286%"}}><Text></Text></View>
          <View style={{...styles.cell, width: "14.285714285714286%"}}><Text></Text></View>
          <View style={{...styles.cell, width: "14.285714285714286%"}}><Text></Text></View>
          <View style={{...styles.cell, width: "14.285714285714286%"}}><Text></Text></View>
        </View>
      </View>
      <Text style={styles.p}>Assessments for the year:</Text>
      <View style={styles.table}>
        <View style={styles.row}>
          <View style={{...styles.cell, width: "50.0%"}}><Text></Text></View>
          <View style={{...styles.cell, width: "50.0%"}}><Text>% of your plants and offices that were assessed (by entity or statutory authorities or third parties)</Text></View>
        </View>
        <View style={styles.row}>
          <View style={{...styles.cell, width: "50.0%"}}><Text>Health and safety practices</Text></View>
          <View style={{...styles.cell, width: "50.0%"}}><Text></Text></View>
        </View>
        <View style={styles.row}>
          <View style={{...styles.cell, width: "50.0%"}}><Text>Working Conditions</Text></View>
          <View style={{...styles.cell, width: "50.0%"}}><Text></Text></View>
        </View>
      </View>
      <Text style={styles.p}>Provide details of any corrective action taken or underway to address safety-related incidents (if any) and on significant risks / concerns arising from assessments of health &amp; safety practices and working conditions.</Text>
      <Text style={styles.p}>Leadership Indicators</Text>
      <Text style={styles.p}>Does the entity extend any life insurance or any compensatory package in the event of death of</Text>
      <Text style={styles.p}>(A) Employees (Y/N) – Yes</Text>
      <Text style={styles.p}>(B) Workers (Y/N) – Yes</Text>
      <Text style={styles.p}>Provide the measures undertaken by the entity to ensure that statutory dues have been deducted and deposited by the value chain partners.</Text>
      <Text style={styles.p}>Provide the number of employees / workers having suffered high consequence work- related injury / ill-health / fatalities (as reported in Q11 of Essential Indicators above), who have been are rehabilitated and placed in suitable employment or whose family members have been placed in suitable employment:</Text>
      <View style={styles.table}>
        <View style={styles.row}>
          <View style={{...styles.cell, width: "20.0%"}}><Text></Text></View>
          <View style={{...styles.cell, width: "20.0%"}}><Text></Text></View>
          <View style={{...styles.cell, width: "20.0%"}}><Text></Text></View>
          <View style={{...styles.cell, width: "20.0%"}}><Text></Text></View>
          <View style={{...styles.cell, width: "20.0%"}}><Text></Text></View>
        </View>
        <View style={styles.row}>
          <View style={{...styles.cell, width: "20.0%"}}><Text></Text></View>
          <View style={{...styles.cell, width: "20.0%"}}><Text>FY (2024-25) (Current Financial  Year)</Text></View>
          <View style={{...styles.cell, width: "20.0%"}}><Text></Text></View>
          <View style={{...styles.cell, width: "20.0%"}}><Text></Text></View>
          <View style={{...styles.cell, width: "20.0%"}}><Text></Text></View>
        </View>
        <View style={styles.row}>
          <View style={{...styles.cell, width: "20.0%"}}><Text>Employees</Text></View>
          <View style={{...styles.cell, width: "20.0%"}}><Text>0</Text></View>
          <View style={{...styles.cell, width: "20.0%"}}><Text></Text></View>
          <View style={{...styles.cell, width: "20.0%"}}><Text></Text></View>
          <View style={{...styles.cell, width: "20.0%"}}><Text></Text></View>
        </View>
        <View style={styles.row}>
          <View style={{...styles.cell, width: "20.0%"}}><Text>Workers</Text></View>
          <View style={{...styles.cell, width: "20.0%"}}><Text>0</Text></View>
          <View style={{...styles.cell, width: "20.0%"}}><Text></Text></View>
          <View style={{...styles.cell, width: "20.0%"}}><Text></Text></View>
          <View style={{...styles.cell, width: "20.0%"}}><Text></Text></View>
        </View>
      </View>
      <Text style={styles.p}>Does the entity provide transition assistance programs to facilitate continued employability and the management of career endings resulting from retirement or termination of employment? (Yes/ No)</Text>
      <Text style={styles.p}>No,</Text>
      <Text style={styles.p}>Details on assessment of value chain partners:</Text>
      <View style={styles.table}>
        <View style={styles.row}>
          <View style={{...styles.cell, width: "50.0%"}}><Text></Text></View>
          <View style={{...styles.cell, width: "50.0%"}}><Text>% of value chain partners (by value of business done with such partners) that were assessed</Text></View>
        </View>
        <View style={styles.row}>
          <View style={{...styles.cell, width: "50.0%"}}><Text>Health and safety practices</Text></View>
          <View style={{...styles.cell, width: "50.0%"}}><Text></Text></View>
        </View>
        <View style={styles.row}>
          <View style={{...styles.cell, width: "50.0%"}}><Text>Working Conditions</Text></View>
          <View style={{...styles.cell, width: "50.0%"}}><Text></Text></View>
        </View>
      </View>
      <Text style={styles.p}>Provide details of any corrective actions taken or underway to address significant risks / concerns arising from assessments of health and safety practices and working conditions of value chain partners.</Text>
      <Text style={styles.p}>Essential Indicators</Text>
      <Text style={styles.p}>Describe the processes for identifying key stakeholder groups of the entity.</Text>
      <Text style={styles.p}>List stakeholder groups identified as key for your entity and the frequency of engagement with each stakeholder group.</Text>
      <View style={styles.table}>
        <View style={styles.row}>
          <View style={{...styles.cell, width: "20.0%"}}><Text>Stakeholder Group</Text></View>
          <View style={{...styles.cell, width: "20.0%"}}><Text>Whether  identified as  Vulnerable &amp;  Marginalized  Group  (Yes/No)</Text></View>
          <View style={{...styles.cell, width: "20.0%"}}><Text></Text></View>
          <View style={{...styles.cell, width: "20.0%"}}><Text></Text></View>
          <View style={{...styles.cell, width: "20.0%"}}><Text></Text></View>
        </View>
        <View style={styles.row}>
          <View style={{...styles.cell, width: "20.0%"}}><Text>Employees</Text></View>
          <View style={{...styles.cell, width: "20.0%"}}><Text>No</Text></View>
          <View style={{...styles.cell, width: "20.0%"}}><Text></Text></View>
          <View style={{...styles.cell, width: "20.0%"}}><Text></Text></View>
          <View style={{...styles.cell, width: "20.0%"}}><Text></Text></View>
        </View>
        <View style={styles.row}>
          <View style={{...styles.cell, width: "20.0%"}}><Text>Shareholders</Text></View>
          <View style={{...styles.cell, width: "20.0%"}}><Text>No</Text></View>
          <View style={{...styles.cell, width: "20.0%"}}><Text></Text></View>
          <View style={{...styles.cell, width: "20.0%"}}><Text></Text></View>
          <View style={{...styles.cell, width: "20.0%"}}><Text></Text></View>
        </View>
        <View style={styles.row}>
          <View style={{...styles.cell, width: "20.0%"}}><Text>Investors</Text></View>
          <View style={{...styles.cell, width: "20.0%"}}><Text>No</Text></View>
          <View style={{...styles.cell, width: "20.0%"}}><Text></Text></View>
          <View style={{...styles.cell, width: "20.0%"}}><Text></Text></View>
          <View style={{...styles.cell, width: "20.0%"}}><Text></Text></View>
        </View>
        <View style={styles.row}>
          <View style={{...styles.cell, width: "20.0%"}}><Text>Suppliers</Text></View>
          <View style={{...styles.cell, width: "20.0%"}}><Text>No</Text></View>
          <View style={{...styles.cell, width: "20.0%"}}><Text></Text></View>
          <View style={{...styles.cell, width: "20.0%"}}><Text></Text></View>
          <View style={{...styles.cell, width: "20.0%"}}><Text></Text></View>
        </View>
        <View style={styles.row}>
          <View style={{...styles.cell, width: "20.0%"}}><Text>Customers</Text></View>
          <View style={{...styles.cell, width: "20.0%"}}><Text>No</Text></View>
          <View style={{...styles.cell, width: "20.0%"}}><Text></Text></View>
          <View style={{...styles.cell, width: "20.0%"}}><Text></Text></View>
          <View style={{...styles.cell, width: "20.0%"}}><Text></Text></View>
        </View>
        <View style={styles.row}>
          <View style={{...styles.cell, width: "20.0%"}}><Text>Suppliers/ Contractors</Text></View>
          <View style={{...styles.cell, width: "20.0%"}}><Text>No</Text></View>
          <View style={{...styles.cell, width: "20.0%"}}><Text></Text></View>
          <View style={{...styles.cell, width: "20.0%"}}><Text></Text></View>
          <View style={{...styles.cell, width: "20.0%"}}><Text></Text></View>
        </View>
        <View style={styles.row}>
          <View style={{...styles.cell, width: "20.0%"}}><Text>Community</Text></View>
          <View style={{...styles.cell, width: "20.0%"}}><Text>Yes</Text></View>
          <View style={{...styles.cell, width: "20.0%"}}><Text></Text></View>
          <View style={{...styles.cell, width: "20.0%"}}><Text></Text></View>
          <View style={{...styles.cell, width: "20.0%"}}><Text></Text></View>
        </View>
      </View>
      <Text style={styles.p}>Leadership Indicators</Text>
      <Text style={styles.p}>Provide the processes for consultation between stakeholders and the Board on economic, environmental, and social topics or if consultation is delegated, how is feedback from such consultations provided to the Board.</Text>
      <Text style={styles.p}>Whether stakeholder consultation is used to support the identification and management of environmental, and social topics (Yes / No). If so, provide details of instances as to how the inputs received from stakeholders on these topics were incorporated into policies and activities of the entity.</Text>
      <Text style={styles.p}>Provide details of instances of engagement with, and actions taken to, address the concerns of vulnerable/ marginalized stakeholder groups.</Text>
      <Text style={styles.p}>The Company has demonstrated a commitment to supporting vulnerable groups by engaging in various initiatives. The Company have partnered with an independent NGO, Aastha Charitable Trust, to provide a residential complex called “ANAND DHAM” for the mentally challenged and those with aging or posthumous parental care needs. In the similar manner the Company has made a Corporate Social Responsibility (CSR) contribution to the Akshar Trust for Education and Welfare of deaf Children and for Trainees, Sant Vinoba Gram Swarajya Ashram for Animal Welfare and Prashanti Medical Services and Research Foundation  for free of cost Heart Surgery to needy people.</Text>
      <Text style={styles.p}>So far during FY 24-25 the Company has contributed approximately ₹ 1.71 crore towards the welfare of vulnerable groups, ensuring that their outreach programs address the unique needs of these individuals.</Text>
      <Text style={styles.p}>Essential Indicators</Text>
      <Text style={styles.p}>Employees and workers who have been provided training on human rights issues and policy(ies) of the entity, in the following format:</Text>
      <View style={styles.table}>
        <View style={styles.row}>
          <View style={{...styles.cell, width: "11.11111111111111%"}}><Text>Category</Text></View>
          <View style={{...styles.cell, width: "11.11111111111111%"}}><Text></Text></View>
          <View style={{...styles.cell, width: "11.11111111111111%"}}><Text></Text></View>
          <View style={{...styles.cell, width: "11.11111111111111%"}}><Text></Text></View>
          <View style={{...styles.cell, width: "11.11111111111111%"}}><Text></Text></View>
          <View style={{...styles.cell, width: "11.11111111111111%"}}><Text></Text></View>
          <View style={{...styles.cell, width: "11.11111111111111%"}}><Text></Text></View>
          <View style={{...styles.cell, width: "11.11111111111111%"}}><Text></Text></View>
          <View style={{...styles.cell, width: "11.11111111111111%"}}><Text></Text></View>
        </View>
        <View style={styles.row}>
          <View style={{...styles.cell, width: "11.11111111111111%"}}><Text>Category</Text></View>
          <View style={{...styles.cell, width: "11.11111111111111%"}}><Text>Total (A)</Text></View>
          <View style={{...styles.cell, width: "11.11111111111111%"}}><Text></Text></View>
          <View style={{...styles.cell, width: "11.11111111111111%"}}><Text></Text></View>
          <View style={{...styles.cell, width: "11.11111111111111%"}}><Text></Text></View>
          <View style={{...styles.cell, width: "11.11111111111111%"}}><Text></Text></View>
          <View style={{...styles.cell, width: "11.11111111111111%"}}><Text></Text></View>
          <View style={{...styles.cell, width: "11.11111111111111%"}}><Text></Text></View>
          <View style={{...styles.cell, width: "11.11111111111111%"}}><Text></Text></View>
        </View>
        <View style={styles.row}>
          <View style={{...styles.cell, width: "11.11111111111111%"}}><Text></Text></View>
          <View style={{...styles.cell, width: "11.11111111111111%"}}><Text></Text></View>
          <View style={{...styles.cell, width: "11.11111111111111%"}}><Text></Text></View>
          <View style={{...styles.cell, width: "11.11111111111111%"}}><Text></Text></View>
          <View style={{...styles.cell, width: "11.11111111111111%"}}><Text></Text></View>
          <View style={{...styles.cell, width: "11.11111111111111%"}}><Text></Text></View>
          <View style={{...styles.cell, width: "11.11111111111111%"}}><Text></Text></View>
          <View style={{...styles.cell, width: "11.11111111111111%"}}><Text></Text></View>
          <View style={{...styles.cell, width: "11.11111111111111%"}}><Text></Text></View>
        </View>
        <View style={styles.row}>
          <View style={{...styles.cell, width: "11.11111111111111%"}}><Text>Permanent</Text></View>
          <View style={{...styles.cell, width: "11.11111111111111%"}}><Text>562</Text></View>
          <View style={{...styles.cell, width: "11.11111111111111%"}}><Text></Text></View>
          <View style={{...styles.cell, width: "11.11111111111111%"}}><Text></Text></View>
          <View style={{...styles.cell, width: "11.11111111111111%"}}><Text></Text></View>
          <View style={{...styles.cell, width: "11.11111111111111%"}}><Text></Text></View>
          <View style={{...styles.cell, width: "11.11111111111111%"}}><Text></Text></View>
          <View style={{...styles.cell, width: "11.11111111111111%"}}><Text></Text></View>
          <View style={{...styles.cell, width: "11.11111111111111%"}}><Text></Text></View>
        </View>
        <View style={styles.row}>
          <View style={{...styles.cell, width: "11.11111111111111%"}}><Text>Other	than permanent</Text></View>
          <View style={{...styles.cell, width: "11.11111111111111%"}}><Text>18</Text></View>
          <View style={{...styles.cell, width: "11.11111111111111%"}}><Text></Text></View>
          <View style={{...styles.cell, width: "11.11111111111111%"}}><Text></Text></View>
          <View style={{...styles.cell, width: "11.11111111111111%"}}><Text></Text></View>
          <View style={{...styles.cell, width: "11.11111111111111%"}}><Text></Text></View>
          <View style={{...styles.cell, width: "11.11111111111111%"}}><Text></Text></View>
          <View style={{...styles.cell, width: "11.11111111111111%"}}><Text></Text></View>
          <View style={{...styles.cell, width: "11.11111111111111%"}}><Text></Text></View>
        </View>
        <View style={styles.row}>
          <View style={{...styles.cell, width: "11.11111111111111%"}}><Text>Total Employees</Text></View>
          <View style={{...styles.cell, width: "11.11111111111111%"}}><Text>580</Text></View>
          <View style={{...styles.cell, width: "11.11111111111111%"}}><Text></Text></View>
          <View style={{...styles.cell, width: "11.11111111111111%"}}><Text></Text></View>
          <View style={{...styles.cell, width: "11.11111111111111%"}}><Text></Text></View>
          <View style={{...styles.cell, width: "11.11111111111111%"}}><Text></Text></View>
          <View style={{...styles.cell, width: "11.11111111111111%"}}><Text></Text></View>
          <View style={{...styles.cell, width: "11.11111111111111%"}}><Text></Text></View>
          <View style={{...styles.cell, width: "11.11111111111111%"}}><Text></Text></View>
        </View>
        <View style={styles.row}>
          <View style={{...styles.cell, width: "11.11111111111111%"}}><Text></Text></View>
          <View style={{...styles.cell, width: "11.11111111111111%"}}><Text></Text></View>
          <View style={{...styles.cell, width: "11.11111111111111%"}}><Text></Text></View>
          <View style={{...styles.cell, width: "11.11111111111111%"}}><Text></Text></View>
          <View style={{...styles.cell, width: "11.11111111111111%"}}><Text></Text></View>
          <View style={{...styles.cell, width: "11.11111111111111%"}}><Text></Text></View>
          <View style={{...styles.cell, width: "11.11111111111111%"}}><Text></Text></View>
          <View style={{...styles.cell, width: "11.11111111111111%"}}><Text></Text></View>
          <View style={{...styles.cell, width: "11.11111111111111%"}}><Text></Text></View>
        </View>
        <View style={styles.row}>
          <View style={{...styles.cell, width: "11.11111111111111%"}}><Text>Permanent</Text></View>
          <View style={{...styles.cell, width: "11.11111111111111%"}}><Text>1084</Text></View>
          <View style={{...styles.cell, width: "11.11111111111111%"}}><Text></Text></View>
          <View style={{...styles.cell, width: "11.11111111111111%"}}><Text></Text></View>
          <View style={{...styles.cell, width: "11.11111111111111%"}}><Text></Text></View>
          <View style={{...styles.cell, width: "11.11111111111111%"}}><Text></Text></View>
          <View style={{...styles.cell, width: "11.11111111111111%"}}><Text></Text></View>
          <View style={{...styles.cell, width: "11.11111111111111%"}}><Text></Text></View>
          <View style={{...styles.cell, width: "11.11111111111111%"}}><Text></Text></View>
        </View>
        <View style={styles.row}>
          <View style={{...styles.cell, width: "11.11111111111111%"}}><Text>Other	than permanent</Text></View>
          <View style={{...styles.cell, width: "11.11111111111111%"}}><Text>1596</Text></View>
          <View style={{...styles.cell, width: "11.11111111111111%"}}><Text></Text></View>
          <View style={{...styles.cell, width: "11.11111111111111%"}}><Text></Text></View>
          <View style={{...styles.cell, width: "11.11111111111111%"}}><Text></Text></View>
          <View style={{...styles.cell, width: "11.11111111111111%"}}><Text></Text></View>
          <View style={{...styles.cell, width: "11.11111111111111%"}}><Text></Text></View>
          <View style={{...styles.cell, width: "11.11111111111111%"}}><Text></Text></View>
          <View style={{...styles.cell, width: "11.11111111111111%"}}><Text></Text></View>
        </View>
        <View style={styles.row}>
          <View style={{...styles.cell, width: "11.11111111111111%"}}><Text>Total Workers</Text></View>
          <View style={{...styles.cell, width: "11.11111111111111%"}}><Text>2680</Text></View>
          <View style={{...styles.cell, width: "11.11111111111111%"}}><Text></Text></View>
          <View style={{...styles.cell, width: "11.11111111111111%"}}><Text></Text></View>
          <View style={{...styles.cell, width: "11.11111111111111%"}}><Text></Text></View>
          <View style={{...styles.cell, width: "11.11111111111111%"}}><Text></Text></View>
          <View style={{...styles.cell, width: "11.11111111111111%"}}><Text></Text></View>
          <View style={{...styles.cell, width: "11.11111111111111%"}}><Text></Text></View>
          <View style={{...styles.cell, width: "11.11111111111111%"}}><Text></Text></View>
        </View>
      </View>
      <Text style={styles.p}>Details of minimum wages paid to employees and workers, in the following format:</Text>
      <View style={styles.table}>
        <View style={styles.row}>
          <View style={{...styles.cell, width: "7.142857142857143%"}}><Text>Category</Text></View>
          <View style={{...styles.cell, width: "7.142857142857143%"}}><Text>Category</Text></View>
          <View style={{...styles.cell, width: "7.142857142857143%"}}><Text></Text></View>
          <View style={{...styles.cell, width: "7.142857142857143%"}}><Text></Text></View>
          <View style={{...styles.cell, width: "7.142857142857143%"}}><Text></Text></View>
          <View style={{...styles.cell, width: "7.142857142857143%"}}><Text></Text></View>
          <View style={{...styles.cell, width: "7.142857142857143%"}}><Text></Text></View>
          <View style={{...styles.cell, width: "7.142857142857143%"}}><Text></Text></View>
          <View style={{...styles.cell, width: "7.142857142857143%"}}><Text></Text></View>
          <View style={{...styles.cell, width: "7.142857142857143%"}}><Text></Text></View>
          <View style={{...styles.cell, width: "7.142857142857143%"}}><Text></Text></View>
          <View style={{...styles.cell, width: "7.142857142857143%"}}><Text></Text></View>
          <View style={{...styles.cell, width: "7.142857142857143%"}}><Text></Text></View>
          <View style={{...styles.cell, width: "7.142857142857143%"}}><Text></Text></View>
        </View>
        <View style={styles.row}>
          <View style={{...styles.cell, width: "7.142857142857143%"}}><Text>Category</Text></View>
          <View style={{...styles.cell, width: "7.142857142857143%"}}><Text>Category</Text></View>
          <View style={{...styles.cell, width: "7.142857142857143%"}}><Text></Text></View>
          <View style={{...styles.cell, width: "7.142857142857143%"}}><Text></Text></View>
          <View style={{...styles.cell, width: "7.142857142857143%"}}><Text></Text></View>
          <View style={{...styles.cell, width: "7.142857142857143%"}}><Text></Text></View>
          <View style={{...styles.cell, width: "7.142857142857143%"}}><Text></Text></View>
          <View style={{...styles.cell, width: "7.142857142857143%"}}><Text></Text></View>
          <View style={{...styles.cell, width: "7.142857142857143%"}}><Text></Text></View>
          <View style={{...styles.cell, width: "7.142857142857143%"}}><Text></Text></View>
          <View style={{...styles.cell, width: "7.142857142857143%"}}><Text></Text></View>
          <View style={{...styles.cell, width: "7.142857142857143%"}}><Text></Text></View>
          <View style={{...styles.cell, width: "7.142857142857143%"}}><Text></Text></View>
          <View style={{...styles.cell, width: "7.142857142857143%"}}><Text></Text></View>
        </View>
        <View style={styles.row}>
          <View style={{...styles.cell, width: "7.142857142857143%"}}><Text>Category</Text></View>
          <View style={{...styles.cell, width: "7.142857142857143%"}}><Text>Category</Text></View>
          <View style={{...styles.cell, width: "7.142857142857143%"}}><Text></Text></View>
          <View style={{...styles.cell, width: "7.142857142857143%"}}><Text></Text></View>
          <View style={{...styles.cell, width: "7.142857142857143%"}}><Text></Text></View>
          <View style={{...styles.cell, width: "7.142857142857143%"}}><Text></Text></View>
          <View style={{...styles.cell, width: "7.142857142857143%"}}><Text></Text></View>
          <View style={{...styles.cell, width: "7.142857142857143%"}}><Text></Text></View>
          <View style={{...styles.cell, width: "7.142857142857143%"}}><Text></Text></View>
          <View style={{...styles.cell, width: "7.142857142857143%"}}><Text></Text></View>
          <View style={{...styles.cell, width: "7.142857142857143%"}}><Text></Text></View>
          <View style={{...styles.cell, width: "7.142857142857143%"}}><Text></Text></View>
          <View style={{...styles.cell, width: "7.142857142857143%"}}><Text></Text></View>
          <View style={{...styles.cell, width: "7.142857142857143%"}}><Text></Text></View>
        </View>
        <View style={styles.row}>
          <View style={{...styles.cell, width: "7.142857142857143%"}}><Text></Text></View>
          <View style={{...styles.cell, width: "7.142857142857143%"}}><Text></Text></View>
          <View style={{...styles.cell, width: "7.142857142857143%"}}><Text></Text></View>
          <View style={{...styles.cell, width: "7.142857142857143%"}}><Text></Text></View>
          <View style={{...styles.cell, width: "7.142857142857143%"}}><Text></Text></View>
          <View style={{...styles.cell, width: "7.142857142857143%"}}><Text></Text></View>
          <View style={{...styles.cell, width: "7.142857142857143%"}}><Text></Text></View>
          <View style={{...styles.cell, width: "7.142857142857143%"}}><Text></Text></View>
          <View style={{...styles.cell, width: "7.142857142857143%"}}><Text></Text></View>
          <View style={{...styles.cell, width: "7.142857142857143%"}}><Text></Text></View>
          <View style={{...styles.cell, width: "7.142857142857143%"}}><Text></Text></View>
          <View style={{...styles.cell, width: "7.142857142857143%"}}><Text></Text></View>
          <View style={{...styles.cell, width: "7.142857142857143%"}}><Text></Text></View>
          <View style={{...styles.cell, width: "7.142857142857143%"}}><Text></Text></View>
        </View>
        <View style={styles.row}>
          <View style={{...styles.cell, width: "7.142857142857143%"}}><Text>Permanent</Text></View>
          <View style={{...styles.cell, width: "7.142857142857143%"}}><Text>Permanent</Text></View>
          <View style={{...styles.cell, width: "7.142857142857143%"}}><Text></Text></View>
          <View style={{...styles.cell, width: "7.142857142857143%"}}><Text></Text></View>
          <View style={{...styles.cell, width: "7.142857142857143%"}}><Text></Text></View>
          <View style={{...styles.cell, width: "7.142857142857143%"}}><Text></Text></View>
          <View style={{...styles.cell, width: "7.142857142857143%"}}><Text></Text></View>
          <View style={{...styles.cell, width: "7.142857142857143%"}}><Text></Text></View>
          <View style={{...styles.cell, width: "7.142857142857143%"}}><Text></Text></View>
          <View style={{...styles.cell, width: "7.142857142857143%"}}><Text></Text></View>
          <View style={{...styles.cell, width: "7.142857142857143%"}}><Text></Text></View>
          <View style={{...styles.cell, width: "7.142857142857143%"}}><Text></Text></View>
          <View style={{...styles.cell, width: "7.142857142857143%"}}><Text></Text></View>
          <View style={{...styles.cell, width: "7.142857142857143%"}}><Text></Text></View>
        </View>
        <View style={styles.row}>
          <View style={{...styles.cell, width: "7.142857142857143%"}}><Text>Male</Text></View>
          <View style={{...styles.cell, width: "7.142857142857143%"}}><Text>Male</Text></View>
          <View style={{...styles.cell, width: "7.142857142857143%"}}><Text></Text></View>
          <View style={{...styles.cell, width: "7.142857142857143%"}}><Text></Text></View>
          <View style={{...styles.cell, width: "7.142857142857143%"}}><Text></Text></View>
          <View style={{...styles.cell, width: "7.142857142857143%"}}><Text></Text></View>
          <View style={{...styles.cell, width: "7.142857142857143%"}}><Text></Text></View>
          <View style={{...styles.cell, width: "7.142857142857143%"}}><Text></Text></View>
          <View style={{...styles.cell, width: "7.142857142857143%"}}><Text></Text></View>
          <View style={{...styles.cell, width: "7.142857142857143%"}}><Text></Text></View>
          <View style={{...styles.cell, width: "7.142857142857143%"}}><Text></Text></View>
          <View style={{...styles.cell, width: "7.142857142857143%"}}><Text></Text></View>
          <View style={{...styles.cell, width: "7.142857142857143%"}}><Text></Text></View>
          <View style={{...styles.cell, width: "7.142857142857143%"}}><Text></Text></View>
        </View>
        <View style={styles.row}>
          <View style={{...styles.cell, width: "7.142857142857143%"}}><Text>Female</Text></View>
          <View style={{...styles.cell, width: "7.142857142857143%"}}><Text>Female</Text></View>
          <View style={{...styles.cell, width: "7.142857142857143%"}}><Text></Text></View>
          <View style={{...styles.cell, width: "7.142857142857143%"}}><Text></Text></View>
          <View style={{...styles.cell, width: "7.142857142857143%"}}><Text></Text></View>
          <View style={{...styles.cell, width: "7.142857142857143%"}}><Text></Text></View>
          <View style={{...styles.cell, width: "7.142857142857143%"}}><Text></Text></View>
          <View style={{...styles.cell, width: "7.142857142857143%"}}><Text></Text></View>
          <View style={{...styles.cell, width: "7.142857142857143%"}}><Text></Text></View>
          <View style={{...styles.cell, width: "7.142857142857143%"}}><Text></Text></View>
          <View style={{...styles.cell, width: "7.142857142857143%"}}><Text></Text></View>
          <View style={{...styles.cell, width: "7.142857142857143%"}}><Text></Text></View>
          <View style={{...styles.cell, width: "7.142857142857143%"}}><Text></Text></View>
          <View style={{...styles.cell, width: "7.142857142857143%"}}><Text></Text></View>
        </View>
        <View style={styles.row}>
          <View style={{...styles.cell, width: "7.142857142857143%"}}><Text>Other Permanent</Text></View>
          <View style={{...styles.cell, width: "7.142857142857143%"}}><Text>than</Text></View>
          <View style={{...styles.cell, width: "7.142857142857143%"}}><Text></Text></View>
          <View style={{...styles.cell, width: "7.142857142857143%"}}><Text></Text></View>
          <View style={{...styles.cell, width: "7.142857142857143%"}}><Text></Text></View>
          <View style={{...styles.cell, width: "7.142857142857143%"}}><Text></Text></View>
          <View style={{...styles.cell, width: "7.142857142857143%"}}><Text></Text></View>
          <View style={{...styles.cell, width: "7.142857142857143%"}}><Text></Text></View>
          <View style={{...styles.cell, width: "7.142857142857143%"}}><Text></Text></View>
          <View style={{...styles.cell, width: "7.142857142857143%"}}><Text></Text></View>
          <View style={{...styles.cell, width: "7.142857142857143%"}}><Text></Text></View>
          <View style={{...styles.cell, width: "7.142857142857143%"}}><Text></Text></View>
          <View style={{...styles.cell, width: "7.142857142857143%"}}><Text></Text></View>
          <View style={{...styles.cell, width: "7.142857142857143%"}}><Text></Text></View>
        </View>
        <View style={styles.row}>
          <View style={{...styles.cell, width: "7.142857142857143%"}}><Text>Male</Text></View>
          <View style={{...styles.cell, width: "7.142857142857143%"}}><Text>Male</Text></View>
          <View style={{...styles.cell, width: "7.142857142857143%"}}><Text></Text></View>
          <View style={{...styles.cell, width: "7.142857142857143%"}}><Text></Text></View>
          <View style={{...styles.cell, width: "7.142857142857143%"}}><Text></Text></View>
          <View style={{...styles.cell, width: "7.142857142857143%"}}><Text></Text></View>
          <View style={{...styles.cell, width: "7.142857142857143%"}}><Text></Text></View>
          <View style={{...styles.cell, width: "7.142857142857143%"}}><Text></Text></View>
          <View style={{...styles.cell, width: "7.142857142857143%"}}><Text></Text></View>
          <View style={{...styles.cell, width: "7.142857142857143%"}}><Text></Text></View>
          <View style={{...styles.cell, width: "7.142857142857143%"}}><Text></Text></View>
          <View style={{...styles.cell, width: "7.142857142857143%"}}><Text></Text></View>
          <View style={{...styles.cell, width: "7.142857142857143%"}}><Text></Text></View>
          <View style={{...styles.cell, width: "7.142857142857143%"}}><Text></Text></View>
        </View>
        <View style={styles.row}>
          <View style={{...styles.cell, width: "7.142857142857143%"}}><Text>Female</Text></View>
          <View style={{...styles.cell, width: "7.142857142857143%"}}><Text>Female</Text></View>
          <View style={{...styles.cell, width: "7.142857142857143%"}}><Text></Text></View>
          <View style={{...styles.cell, width: "7.142857142857143%"}}><Text></Text></View>
          <View style={{...styles.cell, width: "7.142857142857143%"}}><Text></Text></View>
          <View style={{...styles.cell, width: "7.142857142857143%"}}><Text></Text></View>
          <View style={{...styles.cell, width: "7.142857142857143%"}}><Text></Text></View>
          <View style={{...styles.cell, width: "7.142857142857143%"}}><Text></Text></View>
          <View style={{...styles.cell, width: "7.142857142857143%"}}><Text></Text></View>
          <View style={{...styles.cell, width: "7.142857142857143%"}}><Text></Text></View>
          <View style={{...styles.cell, width: "7.142857142857143%"}}><Text></Text></View>
          <View style={{...styles.cell, width: "7.142857142857143%"}}><Text></Text></View>
          <View style={{...styles.cell, width: "7.142857142857143%"}}><Text></Text></View>
          <View style={{...styles.cell, width: "7.142857142857143%"}}><Text></Text></View>
        </View>
        <View style={styles.row}>
          <View style={{...styles.cell, width: "7.142857142857143%"}}><Text></Text></View>
          <View style={{...styles.cell, width: "7.142857142857143%"}}><Text></Text></View>
          <View style={{...styles.cell, width: "7.142857142857143%"}}><Text></Text></View>
          <View style={{...styles.cell, width: "7.142857142857143%"}}><Text></Text></View>
          <View style={{...styles.cell, width: "7.142857142857143%"}}><Text></Text></View>
          <View style={{...styles.cell, width: "7.142857142857143%"}}><Text></Text></View>
          <View style={{...styles.cell, width: "7.142857142857143%"}}><Text></Text></View>
          <View style={{...styles.cell, width: "7.142857142857143%"}}><Text></Text></View>
          <View style={{...styles.cell, width: "7.142857142857143%"}}><Text></Text></View>
          <View style={{...styles.cell, width: "7.142857142857143%"}}><Text></Text></View>
          <View style={{...styles.cell, width: "7.142857142857143%"}}><Text></Text></View>
          <View style={{...styles.cell, width: "7.142857142857143%"}}><Text></Text></View>
          <View style={{...styles.cell, width: "7.142857142857143%"}}><Text></Text></View>
          <View style={{...styles.cell, width: "7.142857142857143%"}}><Text></Text></View>
        </View>
        <View style={styles.row}>
          <View style={{...styles.cell, width: "7.142857142857143%"}}><Text>Permanent</Text></View>
          <View style={{...styles.cell, width: "7.142857142857143%"}}><Text>Permanent</Text></View>
          <View style={{...styles.cell, width: "7.142857142857143%"}}><Text></Text></View>
          <View style={{...styles.cell, width: "7.142857142857143%"}}><Text></Text></View>
          <View style={{...styles.cell, width: "7.142857142857143%"}}><Text></Text></View>
          <View style={{...styles.cell, width: "7.142857142857143%"}}><Text></Text></View>
          <View style={{...styles.cell, width: "7.142857142857143%"}}><Text></Text></View>
          <View style={{...styles.cell, width: "7.142857142857143%"}}><Text></Text></View>
          <View style={{...styles.cell, width: "7.142857142857143%"}}><Text></Text></View>
          <View style={{...styles.cell, width: "7.142857142857143%"}}><Text></Text></View>
          <View style={{...styles.cell, width: "7.142857142857143%"}}><Text></Text></View>
          <View style={{...styles.cell, width: "7.142857142857143%"}}><Text></Text></View>
          <View style={{...styles.cell, width: "7.142857142857143%"}}><Text></Text></View>
          <View style={{...styles.cell, width: "7.142857142857143%"}}><Text></Text></View>
        </View>
        <View style={styles.row}>
          <View style={{...styles.cell, width: "7.142857142857143%"}}><Text>Male</Text></View>
          <View style={{...styles.cell, width: "7.142857142857143%"}}><Text>Male</Text></View>
          <View style={{...styles.cell, width: "7.142857142857143%"}}><Text></Text></View>
          <View style={{...styles.cell, width: "7.142857142857143%"}}><Text></Text></View>
          <View style={{...styles.cell, width: "7.142857142857143%"}}><Text></Text></View>
          <View style={{...styles.cell, width: "7.142857142857143%"}}><Text></Text></View>
          <View style={{...styles.cell, width: "7.142857142857143%"}}><Text></Text></View>
          <View style={{...styles.cell, width: "7.142857142857143%"}}><Text></Text></View>
          <View style={{...styles.cell, width: "7.142857142857143%"}}><Text></Text></View>
          <View style={{...styles.cell, width: "7.142857142857143%"}}><Text></Text></View>
          <View style={{...styles.cell, width: "7.142857142857143%"}}><Text></Text></View>
          <View style={{...styles.cell, width: "7.142857142857143%"}}><Text></Text></View>
          <View style={{...styles.cell, width: "7.142857142857143%"}}><Text></Text></View>
          <View style={{...styles.cell, width: "7.142857142857143%"}}><Text></Text></View>
        </View>
        <View style={styles.row}>
          <View style={{...styles.cell, width: "7.142857142857143%"}}><Text>Female</Text></View>
          <View style={{...styles.cell, width: "7.142857142857143%"}}><Text>Female</Text></View>
          <View style={{...styles.cell, width: "7.142857142857143%"}}><Text></Text></View>
          <View style={{...styles.cell, width: "7.142857142857143%"}}><Text></Text></View>
          <View style={{...styles.cell, width: "7.142857142857143%"}}><Text></Text></View>
          <View style={{...styles.cell, width: "7.142857142857143%"}}><Text></Text></View>
          <View style={{...styles.cell, width: "7.142857142857143%"}}><Text></Text></View>
          <View style={{...styles.cell, width: "7.142857142857143%"}}><Text></Text></View>
          <View style={{...styles.cell, width: "7.142857142857143%"}}><Text></Text></View>
          <View style={{...styles.cell, width: "7.142857142857143%"}}><Text></Text></View>
          <View style={{...styles.cell, width: "7.142857142857143%"}}><Text></Text></View>
          <View style={{...styles.cell, width: "7.142857142857143%"}}><Text></Text></View>
          <View style={{...styles.cell, width: "7.142857142857143%"}}><Text></Text></View>
          <View style={{...styles.cell, width: "7.142857142857143%"}}><Text></Text></View>
        </View>
        <View style={styles.row}>
          <View style={{...styles.cell, width: "7.142857142857143%"}}><Text>Other Permanent</Text></View>
          <View style={{...styles.cell, width: "7.142857142857143%"}}><Text>than</Text></View>
          <View style={{...styles.cell, width: "7.142857142857143%"}}><Text></Text></View>
          <View style={{...styles.cell, width: "7.142857142857143%"}}><Text></Text></View>
          <View style={{...styles.cell, width: "7.142857142857143%"}}><Text></Text></View>
          <View style={{...styles.cell, width: "7.142857142857143%"}}><Text></Text></View>
          <View style={{...styles.cell, width: "7.142857142857143%"}}><Text></Text></View>
          <View style={{...styles.cell, width: "7.142857142857143%"}}><Text></Text></View>
          <View style={{...styles.cell, width: "7.142857142857143%"}}><Text></Text></View>
          <View style={{...styles.cell, width: "7.142857142857143%"}}><Text></Text></View>
          <View style={{...styles.cell, width: "7.142857142857143%"}}><Text></Text></View>
          <View style={{...styles.cell, width: "7.142857142857143%"}}><Text></Text></View>
          <View style={{...styles.cell, width: "7.142857142857143%"}}><Text></Text></View>
          <View style={{...styles.cell, width: "7.142857142857143%"}}><Text></Text></View>
        </View>
        <View style={styles.row}>
          <View style={{...styles.cell, width: "7.142857142857143%"}}><Text>Male</Text></View>
          <View style={{...styles.cell, width: "7.142857142857143%"}}><Text>Male</Text></View>
          <View style={{...styles.cell, width: "7.142857142857143%"}}><Text></Text></View>
          <View style={{...styles.cell, width: "7.142857142857143%"}}><Text></Text></View>
          <View style={{...styles.cell, width: "7.142857142857143%"}}><Text></Text></View>
          <View style={{...styles.cell, width: "7.142857142857143%"}}><Text></Text></View>
          <View style={{...styles.cell, width: "7.142857142857143%"}}><Text></Text></View>
          <View style={{...styles.cell, width: "7.142857142857143%"}}><Text></Text></View>
          <View style={{...styles.cell, width: "7.142857142857143%"}}><Text></Text></View>
          <View style={{...styles.cell, width: "7.142857142857143%"}}><Text></Text></View>
          <View style={{...styles.cell, width: "7.142857142857143%"}}><Text></Text></View>
          <View style={{...styles.cell, width: "7.142857142857143%"}}><Text></Text></View>
          <View style={{...styles.cell, width: "7.142857142857143%"}}><Text></Text></View>
          <View style={{...styles.cell, width: "7.142857142857143%"}}><Text></Text></View>
        </View>
        <View style={styles.row}>
          <View style={{...styles.cell, width: "7.142857142857143%"}}><Text>Female</Text></View>
          <View style={{...styles.cell, width: "7.142857142857143%"}}><Text>Female</Text></View>
          <View style={{...styles.cell, width: "7.142857142857143%"}}><Text></Text></View>
          <View style={{...styles.cell, width: "7.142857142857143%"}}><Text></Text></View>
          <View style={{...styles.cell, width: "7.142857142857143%"}}><Text></Text></View>
          <View style={{...styles.cell, width: "7.142857142857143%"}}><Text></Text></View>
          <View style={{...styles.cell, width: "7.142857142857143%"}}><Text></Text></View>
          <View style={{...styles.cell, width: "7.142857142857143%"}}><Text></Text></View>
          <View style={{...styles.cell, width: "7.142857142857143%"}}><Text></Text></View>
          <View style={{...styles.cell, width: "7.142857142857143%"}}><Text></Text></View>
          <View style={{...styles.cell, width: "7.142857142857143%"}}><Text></Text></View>
          <View style={{...styles.cell, width: "7.142857142857143%"}}><Text></Text></View>
          <View style={{...styles.cell, width: "7.142857142857143%"}}><Text></Text></View>
          <View style={{...styles.cell, width: "7.142857142857143%"}}><Text></Text></View>
        </View>
      </View>
      <Text style={styles.p}>Details of remuneration/salary/wages.</Text>
      <Text style={styles.p}>Median remuneration / wages:</Text>
      <View style={styles.table}>
        <View style={styles.row}>
          <View style={{...styles.cell, width: "20.0%"}}><Text></Text></View>
          <View style={{...styles.cell, width: "20.0%"}}><Text></Text></View>
          <View style={{...styles.cell, width: "20.0%"}}><Text></Text></View>
          <View style={{...styles.cell, width: "20.0%"}}><Text></Text></View>
          <View style={{...styles.cell, width: "20.0%"}}><Text></Text></View>
        </View>
        <View style={styles.row}>
          <View style={{...styles.cell, width: "20.0%"}}><Text></Text></View>
          <View style={{...styles.cell, width: "20.0%"}}><Text>Number</Text></View>
          <View style={{...styles.cell, width: "20.0%"}}><Text></Text></View>
          <View style={{...styles.cell, width: "20.0%"}}><Text></Text></View>
          <View style={{...styles.cell, width: "20.0%"}}><Text></Text></View>
        </View>
        <View style={styles.row}>
          <View style={{...styles.cell, width: "20.0%"}}><Text>Board of Directors (BoD)</Text></View>
          <View style={{...styles.cell, width: "20.0%"}}><Text></Text></View>
          <View style={{...styles.cell, width: "20.0%"}}><Text></Text></View>
          <View style={{...styles.cell, width: "20.0%"}}><Text></Text></View>
          <View style={{...styles.cell, width: "20.0%"}}><Text></Text></View>
        </View>
        <View style={styles.row}>
          <View style={{...styles.cell, width: "20.0%"}}><Text>Key Managerial Personnel</Text></View>
          <View style={{...styles.cell, width: "20.0%"}}><Text></Text></View>
          <View style={{...styles.cell, width: "20.0%"}}><Text></Text></View>
          <View style={{...styles.cell, width: "20.0%"}}><Text></Text></View>
          <View style={{...styles.cell, width: "20.0%"}}><Text></Text></View>
        </View>
        <View style={styles.row}>
          <View style={{...styles.cell, width: "20.0%"}}><Text>Employees other than BoD and KMP</Text></View>
          <View style={{...styles.cell, width: "20.0%"}}><Text></Text></View>
          <View style={{...styles.cell, width: "20.0%"}}><Text></Text></View>
          <View style={{...styles.cell, width: "20.0%"}}><Text></Text></View>
          <View style={{...styles.cell, width: "20.0%"}}><Text></Text></View>
        </View>
        <View style={styles.row}>
          <View style={{...styles.cell, width: "20.0%"}}><Text>Workers</Text></View>
          <View style={{...styles.cell, width: "20.0%"}}><Text></Text></View>
          <View style={{...styles.cell, width: "20.0%"}}><Text></Text></View>
          <View style={{...styles.cell, width: "20.0%"}}><Text></Text></View>
          <View style={{...styles.cell, width: "20.0%"}}><Text></Text></View>
        </View>
      </View>
      <Text style={styles.p}>Gross wages paid to females as % of total wages paid by the entity, in the following format:</Text>
      <View style={styles.table}>
        <View style={styles.row}>
          <View style={{...styles.cell, width: "33.333333333333336%"}}><Text></Text></View>
          <View style={{...styles.cell, width: "33.333333333333336%"}}><Text>FY (2024-25)      Current Financial Year</Text></View>
          <View style={{...styles.cell, width: "33.333333333333336%"}}><Text></Text></View>
        </View>
        <View style={styles.row}>
          <View style={{...styles.cell, width: "33.333333333333336%"}}><Text>Gross	wages	paid	to  females as % of total wages</Text></View>
          <View style={{...styles.cell, width: "33.333333333333336%"}}><Text></Text></View>
          <View style={{...styles.cell, width: "33.333333333333336%"}}><Text></Text></View>
        </View>
      </View>
      <Text style={styles.p}>Do you have a focal point (Individual/ Committee) responsible for addressing human rights impacts or issues caused or contributed to by the business? (Yes/No)</Text>
      <Text style={styles.p}>Describe the internal mechanisms in place to redress grievances related to human rights issues.</Text>
      <Text style={styles.p}>Number of Complaints on the following made by employees and workers:</Text>
      <View style={styles.table}>
        <View style={styles.row}>
          <View style={{...styles.cell, width: "14.285714285714286%"}}><Text></Text></View>
          <View style={{...styles.cell, width: "14.285714285714286%"}}><Text></Text></View>
          <View style={{...styles.cell, width: "14.285714285714286%"}}><Text></Text></View>
          <View style={{...styles.cell, width: "14.285714285714286%"}}><Text></Text></View>
          <View style={{...styles.cell, width: "14.285714285714286%"}}><Text></Text></View>
          <View style={{...styles.cell, width: "14.285714285714286%"}}><Text></Text></View>
          <View style={{...styles.cell, width: "14.285714285714286%"}}><Text></Text></View>
        </View>
        <View style={styles.row}>
          <View style={{...styles.cell, width: "14.285714285714286%"}}><Text></Text></View>
          <View style={{...styles.cell, width: "14.285714285714286%"}}><Text>Filed during the year</Text></View>
          <View style={{...styles.cell, width: "14.285714285714286%"}}><Text></Text></View>
          <View style={{...styles.cell, width: "14.285714285714286%"}}><Text></Text></View>
          <View style={{...styles.cell, width: "14.285714285714286%"}}><Text></Text></View>
          <View style={{...styles.cell, width: "14.285714285714286%"}}><Text></Text></View>
          <View style={{...styles.cell, width: "14.285714285714286%"}}><Text></Text></View>
        </View>
        <View style={styles.row}>
          <View style={{...styles.cell, width: "14.285714285714286%"}}><Text>Sexual Harassment</Text></View>
          <View style={{...styles.cell, width: "14.285714285714286%"}}><Text></Text></View>
          <View style={{...styles.cell, width: "14.285714285714286%"}}><Text></Text></View>
          <View style={{...styles.cell, width: "14.285714285714286%"}}><Text></Text></View>
          <View style={{...styles.cell, width: "14.285714285714286%"}}><Text></Text></View>
          <View style={{...styles.cell, width: "14.285714285714286%"}}><Text></Text></View>
          <View style={{...styles.cell, width: "14.285714285714286%"}}><Text></Text></View>
        </View>
        <View style={styles.row}>
          <View style={{...styles.cell, width: "14.285714285714286%"}}><Text>Discrimination	at workplace</Text></View>
          <View style={{...styles.cell, width: "14.285714285714286%"}}><Text></Text></View>
          <View style={{...styles.cell, width: "14.285714285714286%"}}><Text></Text></View>
          <View style={{...styles.cell, width: "14.285714285714286%"}}><Text></Text></View>
          <View style={{...styles.cell, width: "14.285714285714286%"}}><Text></Text></View>
          <View style={{...styles.cell, width: "14.285714285714286%"}}><Text></Text></View>
          <View style={{...styles.cell, width: "14.285714285714286%"}}><Text></Text></View>
        </View>
        <View style={styles.row}>
          <View style={{...styles.cell, width: "14.285714285714286%"}}><Text>Child Labour</Text></View>
          <View style={{...styles.cell, width: "14.285714285714286%"}}><Text></Text></View>
          <View style={{...styles.cell, width: "14.285714285714286%"}}><Text></Text></View>
          <View style={{...styles.cell, width: "14.285714285714286%"}}><Text></Text></View>
          <View style={{...styles.cell, width: "14.285714285714286%"}}><Text></Text></View>
          <View style={{...styles.cell, width: "14.285714285714286%"}}><Text></Text></View>
          <View style={{...styles.cell, width: "14.285714285714286%"}}><Text></Text></View>
        </View>
        <View style={styles.row}>
          <View style={{...styles.cell, width: "14.285714285714286%"}}><Text>Forced Labour/Involuntary Labour</Text></View>
          <View style={{...styles.cell, width: "14.285714285714286%"}}><Text></Text></View>
          <View style={{...styles.cell, width: "14.285714285714286%"}}><Text></Text></View>
          <View style={{...styles.cell, width: "14.285714285714286%"}}><Text></Text></View>
          <View style={{...styles.cell, width: "14.285714285714286%"}}><Text></Text></View>
          <View style={{...styles.cell, width: "14.285714285714286%"}}><Text></Text></View>
          <View style={{...styles.cell, width: "14.285714285714286%"}}><Text></Text></View>
        </View>
        <View style={styles.row}>
          <View style={{...styles.cell, width: "14.285714285714286%"}}><Text>Wages</Text></View>
          <View style={{...styles.cell, width: "14.285714285714286%"}}><Text></Text></View>
          <View style={{...styles.cell, width: "14.285714285714286%"}}><Text></Text></View>
          <View style={{...styles.cell, width: "14.285714285714286%"}}><Text></Text></View>
          <View style={{...styles.cell, width: "14.285714285714286%"}}><Text></Text></View>
          <View style={{...styles.cell, width: "14.285714285714286%"}}><Text></Text></View>
          <View style={{...styles.cell, width: "14.285714285714286%"}}><Text></Text></View>
        </View>
        <View style={styles.row}>
          <View style={{...styles.cell, width: "14.285714285714286%"}}><Text>Other	human  rights	related issues</Text></View>
          <View style={{...styles.cell, width: "14.285714285714286%"}}><Text></Text></View>
          <View style={{...styles.cell, width: "14.285714285714286%"}}><Text></Text></View>
          <View style={{...styles.cell, width: "14.285714285714286%"}}><Text></Text></View>
          <View style={{...styles.cell, width: "14.285714285714286%"}}><Text></Text></View>
          <View style={{...styles.cell, width: "14.285714285714286%"}}><Text></Text></View>
          <View style={{...styles.cell, width: "14.285714285714286%"}}><Text></Text></View>
        </View>
      </View>
      <Text style={styles.p}>Complaints filed under the Sexual Harassment of Women at Workplace (Prevention, Prohibition and Redressal) Act, 2013, in the following format:</Text>
      <View style={styles.table}>
        <View style={styles.row}>
          <View style={{...styles.cell, width: "33.333333333333336%"}}><Text></Text></View>
          <View style={{...styles.cell, width: "33.333333333333336%"}}><Text>FY (2024-25)  Current Financial Year</Text></View>
          <View style={{...styles.cell, width: "33.333333333333336%"}}><Text></Text></View>
        </View>
        <View style={styles.row}>
          <View style={{...styles.cell, width: "33.333333333333336%"}}><Text>Total Complaints reported under Sexual Harassment on of Women at Workplace (Prevention, Prohibition  and Redressal) Act, 2013 (POSH)</Text></View>
          <View style={{...styles.cell, width: "33.333333333333336%"}}><Text></Text></View>
          <View style={{...styles.cell, width: "33.333333333333336%"}}><Text></Text></View>
        </View>
        <View style={styles.row}>
          <View style={{...styles.cell, width: "33.333333333333336%"}}><Text>Complaints on POSH as a % of  female employees / workers</Text></View>
          <View style={{...styles.cell, width: "33.333333333333336%"}}><Text></Text></View>
          <View style={{...styles.cell, width: "33.333333333333336%"}}><Text></Text></View>
        </View>
        <View style={styles.row}>
          <View style={{...styles.cell, width: "33.333333333333336%"}}><Text>Complaints on POSH upheld</Text></View>
          <View style={{...styles.cell, width: "33.333333333333336%"}}><Text></Text></View>
          <View style={{...styles.cell, width: "33.333333333333336%"}}><Text></Text></View>
        </View>
      </View>
      <Text style={styles.p}>Mechanisms to prevent adverse consequences to the complainant in discrimination and harassment cases.</Text>
      <Text style={styles.p}>Do human rights requirements form part of your business agreements and contracts? (Yes/No)</Text>
      <Text style={styles.p}>Assessment for the year:</Text>
      <View style={styles.table}>
        <View style={styles.row}>
          <View style={{...styles.cell, width: "50.0%"}}><Text></Text></View>
          <View style={{...styles.cell, width: "50.0%"}}><Text>% of your plants and offices that were assessed (by entity or statutory authorities or third parties)</Text></View>
        </View>
        <View style={styles.row}>
          <View style={{...styles.cell, width: "50.0%"}}><Text>Child labour</Text></View>
          <View style={{...styles.cell, width: "50.0%"}}><Text></Text></View>
        </View>
        <View style={styles.row}>
          <View style={{...styles.cell, width: "50.0%"}}><Text>Forced/involuntary labour</Text></View>
          <View style={{...styles.cell, width: "50.0%"}}><Text></Text></View>
        </View>
        <View style={styles.row}>
          <View style={{...styles.cell, width: "50.0%"}}><Text>Sexual harassment</Text></View>
          <View style={{...styles.cell, width: "50.0%"}}><Text></Text></View>
        </View>
        <View style={styles.row}>
          <View style={{...styles.cell, width: "50.0%"}}><Text>Discrimination at workplace</Text></View>
          <View style={{...styles.cell, width: "50.0%"}}><Text></Text></View>
        </View>
        <View style={styles.row}>
          <View style={{...styles.cell, width: "50.0%"}}><Text>Wages</Text></View>
          <View style={{...styles.cell, width: "50.0%"}}><Text></Text></View>
        </View>
        <View style={styles.row}>
          <View style={{...styles.cell, width: "50.0%"}}><Text>Others – please specify</Text></View>
          <View style={{...styles.cell, width: "50.0%"}}><Text></Text></View>
        </View>
      </View>
      <Text style={styles.p}>Provide details of any corrective actions taken or underway to address significant risks / concerns arising from the assessments at Question 10 above.</Text>
      <Text style={styles.p}>Leadership Indicators</Text>
      <Text style={styles.p}>Details of a business process being modified / introduced as a result of addressing human rights grievances/complaints.</Text>
      <Text style={styles.p}>Details of the scope and coverage of any Human rights due-diligence conducted.</Text>
      <Text style={styles.p}>Is the premise/office of the entity accessible to differently abled visitors, as per the requirements of the Rights of Persons with Disabilities Act, 2016?</Text>
      <Text style={styles.p}>Details on assessment of value chain partners</Text>
      <View style={styles.table}>
        <View style={styles.row}>
          <View style={{...styles.cell, width: "50.0%"}}><Text></Text></View>
          <View style={{...styles.cell, width: "50.0%"}}><Text>% of value chain partners (by value of business done with such partners) that were assessed</Text></View>
        </View>
        <View style={styles.row}>
          <View style={{...styles.cell, width: "50.0%"}}><Text>Sexual Harassment</Text></View>
          <View style={{...styles.cell, width: "50.0%"}}><Text></Text></View>
        </View>
        <View style={styles.row}>
          <View style={{...styles.cell, width: "50.0%"}}><Text>Discrimination at workplace</Text></View>
          <View style={{...styles.cell, width: "50.0%"}}><Text></Text></View>
        </View>
        <View style={styles.row}>
          <View style={{...styles.cell, width: "50.0%"}}><Text>Child Labour</Text></View>
          <View style={{...styles.cell, width: "50.0%"}}><Text></Text></View>
        </View>
        <View style={styles.row}>
          <View style={{...styles.cell, width: "50.0%"}}><Text>Forced Labour/Involuntary Labour</Text></View>
          <View style={{...styles.cell, width: "50.0%"}}><Text></Text></View>
        </View>
        <View style={styles.row}>
          <View style={{...styles.cell, width: "50.0%"}}><Text>Wages</Text></View>
          <View style={{...styles.cell, width: "50.0%"}}><Text></Text></View>
        </View>
        <View style={styles.row}>
          <View style={{...styles.cell, width: "50.0%"}}><Text>Others – please specify</Text></View>
          <View style={{...styles.cell, width: "50.0%"}}><Text></Text></View>
        </View>
      </View>
      <Text style={styles.p}>5. Provide details of any corrective actions taken or underway to address significant risks / concerns arising from the assessments at Question 4 above.</Text>
      <Text style={styles.p}>Essential Indicators</Text>
      <Text style={styles.p}>Details of total energy consumption (in Joules or multiples) and energy intensity, in the following format:</Text>
      <View style={styles.table}>
        <View style={styles.row}>
          <View style={{...styles.cell, width: "20.0%"}}><Text></Text></View>
          <View style={{...styles.cell, width: "20.0%"}}><Text></Text></View>
          <View style={{...styles.cell, width: "20.0%"}}><Text></Text></View>
          <View style={{...styles.cell, width: "20.0%"}}><Text></Text></View>
          <View style={{...styles.cell, width: "20.0%"}}><Text></Text></View>
        </View>
        <View style={styles.row}>
          <View style={{...styles.cell, width: "20.0%"}}><Text></Text></View>
          <View style={{...styles.cell, width: "20.0%"}}><Text></Text></View>
          <View style={{...styles.cell, width: "20.0%"}}><Text></Text></View>
          <View style={{...styles.cell, width: "20.0%"}}><Text></Text></View>
          <View style={{...styles.cell, width: "20.0%"}}><Text></Text></View>
        </View>
        <View style={styles.row}>
          <View style={{...styles.cell, width: "20.0%"}}><Text></Text></View>
          <View style={{...styles.cell, width: "20.0%"}}><Text></Text></View>
          <View style={{...styles.cell, width: "20.0%"}}><Text></Text></View>
          <View style={{...styles.cell, width: "20.0%"}}><Text></Text></View>
          <View style={{...styles.cell, width: "20.0%"}}><Text></Text></View>
        </View>
        <View style={styles.row}>
          <View style={{...styles.cell, width: "20.0%"}}><Text></Text></View>
          <View style={{...styles.cell, width: "20.0%"}}><Text></Text></View>
          <View style={{...styles.cell, width: "20.0%"}}><Text></Text></View>
          <View style={{...styles.cell, width: "20.0%"}}><Text></Text></View>
          <View style={{...styles.cell, width: "20.0%"}}><Text></Text></View>
        </View>
        <View style={styles.row}>
          <View style={{...styles.cell, width: "20.0%"}}><Text>Energy	consumption  sources (C)</Text></View>
          <View style={{...styles.cell, width: "20.0%"}}><Text>through</Text></View>
          <View style={{...styles.cell, width: "20.0%"}}><Text></Text></View>
          <View style={{...styles.cell, width: "20.0%"}}><Text></Text></View>
          <View style={{...styles.cell, width: "20.0%"}}><Text></Text></View>
        </View>
        <View style={styles.row}>
          <View style={{...styles.cell, width: "20.0%"}}><Text></Text></View>
          <View style={{...styles.cell, width: "20.0%"}}><Text></Text></View>
          <View style={{...styles.cell, width: "20.0%"}}><Text></Text></View>
          <View style={{...styles.cell, width: "20.0%"}}><Text></Text></View>
          <View style={{...styles.cell, width: "20.0%"}}><Text></Text></View>
        </View>
        <View style={styles.row}>
          <View style={{...styles.cell, width: "20.0%"}}><Text></Text></View>
          <View style={{...styles.cell, width: "20.0%"}}><Text></Text></View>
          <View style={{...styles.cell, width: "20.0%"}}><Text></Text></View>
          <View style={{...styles.cell, width: "20.0%"}}><Text></Text></View>
          <View style={{...styles.cell, width: "20.0%"}}><Text></Text></View>
        </View>
        <View style={styles.row}>
          <View style={{...styles.cell, width: "20.0%"}}><Text></Text></View>
          <View style={{...styles.cell, width: "20.0%"}}><Text></Text></View>
          <View style={{...styles.cell, width: "20.0%"}}><Text></Text></View>
          <View style={{...styles.cell, width: "20.0%"}}><Text></Text></View>
          <View style={{...styles.cell, width: "20.0%"}}><Text></Text></View>
        </View>
        <View style={styles.row}>
          <View style={{...styles.cell, width: "20.0%"}}><Text></Text></View>
          <View style={{...styles.cell, width: "20.0%"}}><Text></Text></View>
          <View style={{...styles.cell, width: "20.0%"}}><Text></Text></View>
          <View style={{...styles.cell, width: "20.0%"}}><Text></Text></View>
          <View style={{...styles.cell, width: "20.0%"}}><Text></Text></View>
        </View>
        <View style={styles.row}>
          <View style={{...styles.cell, width: "20.0%"}}><Text>Energy	consumption  sources (F)</Text></View>
          <View style={{...styles.cell, width: "20.0%"}}><Text>through</Text></View>
          <View style={{...styles.cell, width: "20.0%"}}><Text></Text></View>
          <View style={{...styles.cell, width: "20.0%"}}><Text></Text></View>
          <View style={{...styles.cell, width: "20.0%"}}><Text></Text></View>
        </View>
        <View style={styles.row}>
          <View style={{...styles.cell, width: "20.0%"}}><Text></Text></View>
          <View style={{...styles.cell, width: "20.0%"}}><Text></Text></View>
          <View style={{...styles.cell, width: "20.0%"}}><Text></Text></View>
          <View style={{...styles.cell, width: "20.0%"}}><Text></Text></View>
          <View style={{...styles.cell, width: "20.0%"}}><Text></Text></View>
        </View>
        <View style={styles.row}>
          <View style={{...styles.cell, width: "20.0%"}}><Text></Text></View>
          <View style={{...styles.cell, width: "20.0%"}}><Text></Text></View>
          <View style={{...styles.cell, width: "20.0%"}}><Text></Text></View>
          <View style={{...styles.cell, width: "20.0%"}}><Text></Text></View>
          <View style={{...styles.cell, width: "20.0%"}}><Text></Text></View>
        </View>
        <View style={styles.row}>
          <View style={{...styles.cell, width: "20.0%"}}><Text></Text></View>
          <View style={{...styles.cell, width: "20.0%"}}><Text></Text></View>
          <View style={{...styles.cell, width: "20.0%"}}><Text></Text></View>
          <View style={{...styles.cell, width: "20.0%"}}><Text></Text></View>
          <View style={{...styles.cell, width: "20.0%"}}><Text></Text></View>
        </View>
        <View style={styles.row}>
          <View style={{...styles.cell, width: "20.0%"}}><Text></Text></View>
          <View style={{...styles.cell, width: "20.0%"}}><Text></Text></View>
          <View style={{...styles.cell, width: "20.0%"}}><Text></Text></View>
          <View style={{...styles.cell, width: "20.0%"}}><Text></Text></View>
          <View style={{...styles.cell, width: "20.0%"}}><Text></Text></View>
        </View>
        <View style={styles.row}>
          <View style={{...styles.cell, width: "20.0%"}}><Text></Text></View>
          <View style={{...styles.cell, width: "20.0%"}}><Text></Text></View>
          <View style={{...styles.cell, width: "20.0%"}}><Text></Text></View>
          <View style={{...styles.cell, width: "20.0%"}}><Text></Text></View>
          <View style={{...styles.cell, width: "20.0%"}}><Text></Text></View>
        </View>
        <View style={styles.row}>
          <View style={{...styles.cell, width: "20.0%"}}><Text></Text></View>
          <View style={{...styles.cell, width: "20.0%"}}><Text></Text></View>
          <View style={{...styles.cell, width: "20.0%"}}><Text></Text></View>
          <View style={{...styles.cell, width: "20.0%"}}><Text></Text></View>
          <View style={{...styles.cell, width: "20.0%"}}><Text></Text></View>
        </View>
      </View>
      <Text style={styles.p}>Note: Indicate if any independent assessment/ evaluation/assurance has been carried out by an external agency? (Y/N) If yes, name of the external agency.</Text>
      <Text style={styles.p}>2. Does the entity have any sites / facilities identified as designated consumers (DCs) under the Performance, Achieve and Trade (PAT) Scheme of the Government of India? (Y/N) If yes, disclose whether targets set under the PAT scheme have been achieved. In case targets have not been achieved, provide the remedial action taken, if any.</Text>
      <Text style={styles.p}>Provide details of the following disclosures related to water, in the following format:</Text>
      <View style={styles.table}>
        <View style={styles.row}>
          <View style={{...styles.cell, width: "33.333333333333336%"}}><Text>Parameter</Text></View>
          <View style={{...styles.cell, width: "33.333333333333336%"}}><Text>FY (2024-25)  (Current Financial Year)</Text></View>
          <View style={{...styles.cell, width: "33.333333333333336%"}}><Text></Text></View>
        </View>
        <View style={styles.row}>
          <View style={{...styles.cell, width: "33.333333333333336%"}}><Text></Text></View>
          <View style={{...styles.cell, width: "33.333333333333336%"}}><Text></Text></View>
          <View style={{...styles.cell, width: "33.333333333333336%"}}><Text></Text></View>
        </View>
        <View style={styles.row}>
          <View style={{...styles.cell, width: "33.333333333333336%"}}><Text>(i) Surface water</Text></View>
          <View style={{...styles.cell, width: "33.333333333333336%"}}><Text>0.00</Text></View>
          <View style={{...styles.cell, width: "33.333333333333336%"}}><Text></Text></View>
        </View>
        <View style={styles.row}>
          <View style={{...styles.cell, width: "33.333333333333336%"}}><Text>(ii) Groundwater</Text></View>
          <View style={{...styles.cell, width: "33.333333333333336%"}}><Text>28824.00</Text></View>
          <View style={{...styles.cell, width: "33.333333333333336%"}}><Text></Text></View>
        </View>
        <View style={styles.row}>
          <View style={{...styles.cell, width: "33.333333333333336%"}}><Text>(iii) Third party water</Text></View>
          <View style={{...styles.cell, width: "33.333333333333336%"}}><Text>4218.38</Text></View>
          <View style={{...styles.cell, width: "33.333333333333336%"}}><Text></Text></View>
        </View>
        <View style={styles.row}>
          <View style={{...styles.cell, width: "33.333333333333336%"}}><Text>(iv) Seawater / desalinated water</Text></View>
          <View style={{...styles.cell, width: "33.333333333333336%"}}><Text>0.00</Text></View>
          <View style={{...styles.cell, width: "33.333333333333336%"}}><Text></Text></View>
        </View>
        <View style={styles.row}>
          <View style={{...styles.cell, width: "33.333333333333336%"}}><Text>(v) Others</Text></View>
          <View style={{...styles.cell, width: "33.333333333333336%"}}><Text>0.00</Text></View>
          <View style={{...styles.cell, width: "33.333333333333336%"}}><Text></Text></View>
        </View>
        <View style={styles.row}>
          <View style={{...styles.cell, width: "33.333333333333336%"}}><Text>Total volume of water withdrawal  (in kilolitres) (i + ii + iii + iv + v)</Text></View>
          <View style={{...styles.cell, width: "33.333333333333336%"}}><Text>33042.38</Text></View>
          <View style={{...styles.cell, width: "33.333333333333336%"}}><Text></Text></View>
        </View>
        <View style={styles.row}>
          <View style={{...styles.cell, width: "33.333333333333336%"}}><Text>Total volume of water consumption  (in kilolitres)</Text></View>
          <View style={{...styles.cell, width: "33.333333333333336%"}}><Text></Text></View>
          <View style={{...styles.cell, width: "33.333333333333336%"}}><Text></Text></View>
        </View>
        <View style={styles.row}>
          <View style={{...styles.cell, width: "33.333333333333336%"}}><Text>Water	intensity	per	rupee	of turnover  (Total water consumption / Revenue  from operations)</Text></View>
          <View style={{...styles.cell, width: "33.333333333333336%"}}><Text></Text></View>
          <View style={{...styles.cell, width: "33.333333333333336%"}}><Text></Text></View>
        </View>
        <View style={styles.row}>
          <View style={{...styles.cell, width: "33.333333333333336%"}}><Text>Water intensity per rupee of turnover adjusted for Purchasing Power Parity (PPP)  (Total water consumption / Revenue  from operations adjusted for PPP)</Text></View>
          <View style={{...styles.cell, width: "33.333333333333336%"}}><Text></Text></View>
          <View style={{...styles.cell, width: "33.333333333333336%"}}><Text></Text></View>
        </View>
        <View style={styles.row}>
          <View style={{...styles.cell, width: "33.333333333333336%"}}><Text>Water intensity in terms of physical  output</Text></View>
          <View style={{...styles.cell, width: "33.333333333333336%"}}><Text></Text></View>
          <View style={{...styles.cell, width: "33.333333333333336%"}}><Text></Text></View>
        </View>
        <View style={styles.row}>
          <View style={{...styles.cell, width: "33.333333333333336%"}}><Text>Water	intensity	(optional)	–	the relevant metric may be selected by the  entity</Text></View>
          <View style={{...styles.cell, width: "33.333333333333336%"}}><Text></Text></View>
          <View style={{...styles.cell, width: "33.333333333333336%"}}><Text></Text></View>
        </View>
      </View>
      <Text style={styles.p}>Note: Indicate if any independent assessment/ evaluation/assurance has been carried out by an external agency? (Y/N) If yes, name of the external agency.</Text>
      <Text style={styles.p}>Provide the following details related to water discharged:</Text>
      <View style={styles.table}>
        <View style={styles.row}>
          <View style={{...styles.cell, width: "33.333333333333336%"}}><Text>Parameter</Text></View>
          <View style={{...styles.cell, width: "33.333333333333336%"}}><Text>FY (2024-25) (Current Financial Year)</Text></View>
          <View style={{...styles.cell, width: "33.333333333333336%"}}><Text></Text></View>
        </View>
        <View style={styles.row}>
          <View style={{...styles.cell, width: "33.333333333333336%"}}><Text></Text></View>
          <View style={{...styles.cell, width: "33.333333333333336%"}}><Text></Text></View>
          <View style={{...styles.cell, width: "33.333333333333336%"}}><Text></Text></View>
        </View>
        <View style={styles.row}>
          <View style={{...styles.cell, width: "33.333333333333336%"}}><Text>(i) To Surface water</Text></View>
          <View style={{...styles.cell, width: "33.333333333333336%"}}><Text>0.00</Text></View>
          <View style={{...styles.cell, width: "33.333333333333336%"}}><Text></Text></View>
        </View>
        <View style={styles.row}>
          <View style={{...styles.cell, width: "33.333333333333336%"}}><Text>-	No treatment</Text></View>
          <View style={{...styles.cell, width: "33.333333333333336%"}}><Text>0.00</Text></View>
          <View style={{...styles.cell, width: "33.333333333333336%"}}><Text></Text></View>
        </View>
        <View style={styles.row}>
          <View style={{...styles.cell, width: "33.333333333333336%"}}><Text>-	With treatment – please specify level of  treatment</Text></View>
          <View style={{...styles.cell, width: "33.333333333333336%"}}><Text>0.00</Text></View>
          <View style={{...styles.cell, width: "33.333333333333336%"}}><Text></Text></View>
        </View>
        <View style={styles.row}>
          <View style={{...styles.cell, width: "33.333333333333336%"}}><Text>(ii) To Groundwater</Text></View>
          <View style={{...styles.cell, width: "33.333333333333336%"}}><Text>0.00</Text></View>
          <View style={{...styles.cell, width: "33.333333333333336%"}}><Text></Text></View>
        </View>
        <View style={styles.row}>
          <View style={{...styles.cell, width: "33.333333333333336%"}}><Text>-	No treatment</Text></View>
          <View style={{...styles.cell, width: "33.333333333333336%"}}><Text>0.00</Text></View>
          <View style={{...styles.cell, width: "33.333333333333336%"}}><Text></Text></View>
        </View>
        <View style={styles.row}>
          <View style={{...styles.cell, width: "33.333333333333336%"}}><Text>-	With treatment – please specify level of  treatment</Text></View>
          <View style={{...styles.cell, width: "33.333333333333336%"}}><Text>0.00</Text></View>
          <View style={{...styles.cell, width: "33.333333333333336%"}}><Text></Text></View>
        </View>
        <View style={styles.row}>
          <View style={{...styles.cell, width: "33.333333333333336%"}}><Text>(iii) To Seawater</Text></View>
          <View style={{...styles.cell, width: "33.333333333333336%"}}><Text>0.00</Text></View>
          <View style={{...styles.cell, width: "33.333333333333336%"}}><Text></Text></View>
        </View>
        <View style={styles.row}>
          <View style={{...styles.cell, width: "33.333333333333336%"}}><Text>-	No treatment</Text></View>
          <View style={{...styles.cell, width: "33.333333333333336%"}}><Text>0.00</Text></View>
          <View style={{...styles.cell, width: "33.333333333333336%"}}><Text></Text></View>
        </View>
        <View style={styles.row}>
          <View style={{...styles.cell, width: "33.333333333333336%"}}><Text>-	With treatment – please specify level of  treatment</Text></View>
          <View style={{...styles.cell, width: "33.333333333333336%"}}><Text>0.00</Text></View>
          <View style={{...styles.cell, width: "33.333333333333336%"}}><Text></Text></View>
        </View>
        <View style={styles.row}>
          <View style={{...styles.cell, width: "33.333333333333336%"}}><Text>(iv) Sent to third-parties</Text></View>
          <View style={{...styles.cell, width: "33.333333333333336%"}}><Text>0.00</Text></View>
          <View style={{...styles.cell, width: "33.333333333333336%"}}><Text></Text></View>
        </View>
        <View style={styles.row}>
          <View style={{...styles.cell, width: "33.333333333333336%"}}><Text>-	No treatment</Text></View>
          <View style={{...styles.cell, width: "33.333333333333336%"}}><Text>0.00</Text></View>
          <View style={{...styles.cell, width: "33.333333333333336%"}}><Text></Text></View>
        </View>
        <View style={styles.row}>
          <View style={{...styles.cell, width: "33.333333333333336%"}}><Text>-	With treatment – please specify level of  treatment</Text></View>
          <View style={{...styles.cell, width: "33.333333333333336%"}}><Text>0.00</Text></View>
          <View style={{...styles.cell, width: "33.333333333333336%"}}><Text></Text></View>
        </View>
        <View style={styles.row}>
          <View style={{...styles.cell, width: "33.333333333333336%"}}><Text>(v) Others</Text></View>
          <View style={{...styles.cell, width: "33.333333333333336%"}}><Text>0.00</Text></View>
          <View style={{...styles.cell, width: "33.333333333333336%"}}><Text></Text></View>
        </View>
        <View style={styles.row}>
          <View style={{...styles.cell, width: "33.333333333333336%"}}><Text>-	No treatment</Text></View>
          <View style={{...styles.cell, width: "33.333333333333336%"}}><Text>0.00</Text></View>
          <View style={{...styles.cell, width: "33.333333333333336%"}}><Text></Text></View>
        </View>
        <View style={styles.row}>
          <View style={{...styles.cell, width: "33.333333333333336%"}}><Text>-	With treatment – please specify level of  treatment</Text></View>
          <View style={{...styles.cell, width: "33.333333333333336%"}}><Text>0.00</Text></View>
          <View style={{...styles.cell, width: "33.333333333333336%"}}><Text></Text></View>
        </View>
        <View style={styles.row}>
          <View style={{...styles.cell, width: "33.333333333333336%"}}><Text>Total water discharged (in kilolitres)</Text></View>
          <View style={{...styles.cell, width: "33.333333333333336%"}}><Text>0.00</Text></View>
          <View style={{...styles.cell, width: "33.333333333333336%"}}><Text></Text></View>
        </View>
      </View>
      <Text style={styles.p}>Note: Indicate if any independent assessment/ evaluation/assurance has been carried out by an external agency? (Y/N) If yes, name of the external agency.</Text>
      <Text style={styles.p}>Has the entity implemented a mechanism for Zero Liquid Discharge? If yes, provide details of its coverage and implementation.</Text>
      <Text style={styles.p}>Yes, Reuse of treated water is being reused for toilet flushing, solar panel cleaning, cooling tower makeover, gardening &amp; plantation.</Text>
      <Text style={styles.p}>Please provide details of air emissions (other than GHG emissions) by the entity, in the following format:</Text>
      <View style={styles.table}>
        <View style={styles.row}>
          <View style={{...styles.cell, width: "25.0%"}}><Text>Parameter</Text></View>
          <View style={{...styles.cell, width: "25.0%"}}><Text>Please specify unit</Text></View>
          <View style={{...styles.cell, width: "25.0%"}}><Text></Text></View>
          <View style={{...styles.cell, width: "25.0%"}}><Text></Text></View>
        </View>
        <View style={styles.row}>
          <View style={{...styles.cell, width: "25.0%"}}><Text>NOx</Text></View>
          <View style={{...styles.cell, width: "25.0%"}}><Text>PPM</Text></View>
          <View style={{...styles.cell, width: "25.0%"}}><Text></Text></View>
          <View style={{...styles.cell, width: "25.0%"}}><Text></Text></View>
        </View>
        <View style={styles.row}>
          <View style={{...styles.cell, width: "25.0%"}}><Text>SOx</Text></View>
          <View style={{...styles.cell, width: "25.0%"}}><Text>PPM</Text></View>
          <View style={{...styles.cell, width: "25.0%"}}><Text></Text></View>
          <View style={{...styles.cell, width: "25.0%"}}><Text></Text></View>
        </View>
        <View style={styles.row}>
          <View style={{...styles.cell, width: "25.0%"}}><Text>Particulate	matter  (PM)</Text></View>
          <View style={{...styles.cell, width: "25.0%"}}><Text>mg/Nm3</Text></View>
          <View style={{...styles.cell, width: "25.0%"}}><Text></Text></View>
          <View style={{...styles.cell, width: "25.0%"}}><Text></Text></View>
        </View>
        <View style={styles.row}>
          <View style={{...styles.cell, width: "25.0%"}}><Text>Persistent	organic  pollutants (POP)</Text></View>
          <View style={{...styles.cell, width: "25.0%"}}><Text>-</Text></View>
          <View style={{...styles.cell, width: "25.0%"}}><Text></Text></View>
          <View style={{...styles.cell, width: "25.0%"}}><Text></Text></View>
        </View>
        <View style={styles.row}>
          <View style={{...styles.cell, width: "25.0%"}}><Text>Volatile	organic  compounds (VOC)</Text></View>
          <View style={{...styles.cell, width: "25.0%"}}><Text>-</Text></View>
          <View style={{...styles.cell, width: "25.0%"}}><Text></Text></View>
          <View style={{...styles.cell, width: "25.0%"}}><Text></Text></View>
        </View>
        <View style={styles.row}>
          <View style={{...styles.cell, width: "25.0%"}}><Text>Hazardous	air  pollutants (HAP)</Text></View>
          <View style={{...styles.cell, width: "25.0%"}}><Text>-</Text></View>
          <View style={{...styles.cell, width: "25.0%"}}><Text></Text></View>
          <View style={{...styles.cell, width: "25.0%"}}><Text></Text></View>
        </View>
        <View style={styles.row}>
          <View style={{...styles.cell, width: "25.0%"}}><Text>Others	–	please  specify</Text></View>
          <View style={{...styles.cell, width: "25.0%"}}><Text></Text></View>
          <View style={{...styles.cell, width: "25.0%"}}><Text></Text></View>
          <View style={{...styles.cell, width: "25.0%"}}><Text></Text></View>
        </View>
      </View>
      <Text style={styles.p}>Note: Indicate if any independent assessment/ evaluation/assurance has been carried out by an external agency? (Y/N) If yes, name of the external agency.</Text>
      <Text style={styles.p}>Provide details of greenhouse gas emissions (Scope 1 and Scope 2 emissions) &amp; its intensity, in the following format:</Text>
      <View style={styles.table}>
        <View style={styles.row}>
          <View style={{...styles.cell, width: "25.0%"}}><Text>Parameter</Text></View>
          <View style={{...styles.cell, width: "25.0%"}}><Text>Unit</Text></View>
          <View style={{...styles.cell, width: "25.0%"}}><Text></Text></View>
          <View style={{...styles.cell, width: "25.0%"}}><Text></Text></View>
        </View>
        <View style={styles.row}>
          <View style={{...styles.cell, width: "25.0%"}}><Text>Total Scope 1 emissions (Break-up of the GHG into CO2, CH4, N2O, HFCs, PFCs,</Text></View>
          <View style={{...styles.cell, width: "25.0%"}}><Text>Metric tonnes of	CO2  equivalent</Text></View>
          <View style={{...styles.cell, width: "25.0%"}}><Text></Text></View>
          <View style={{...styles.cell, width: "25.0%"}}><Text></Text></View>
        </View>
        <View style={styles.row}>
          <View style={{...styles.cell, width: "25.0%"}}><Text>SF6, NF3, if available)</Text></View>
          <View style={{...styles.cell, width: "25.0%"}}><Text></Text></View>
          <View style={{...styles.cell, width: "25.0%"}}><Text></Text></View>
          <View style={{...styles.cell, width: "25.0%"}}><Text></Text></View>
        </View>
        <View style={styles.row}>
          <View style={{...styles.cell, width: "25.0%"}}><Text>Total Scope 2 emissions (Break-up of the GHG into CO2, CH4, N2O, HFCs, PFCs,</Text></View>
          <View style={{...styles.cell, width: "25.0%"}}><Text>Metric tonnes of	CO2  equivalent</Text></View>
          <View style={{...styles.cell, width: "25.0%"}}><Text></Text></View>
          <View style={{...styles.cell, width: "25.0%"}}><Text></Text></View>
        </View>
        <View style={styles.row}>
          <View style={{...styles.cell, width: "25.0%"}}><Text>SF6, NF3, if available)</Text></View>
          <View style={{...styles.cell, width: "25.0%"}}><Text></Text></View>
          <View style={{...styles.cell, width: "25.0%"}}><Text></Text></View>
          <View style={{...styles.cell, width: "25.0%"}}><Text></Text></View>
        </View>
        <View style={styles.row}>
          <View style={{...styles.cell, width: "25.0%"}}><Text>Total Scope 1 and Scope 2 emission intensity per rupee of turnover  (Total Scope 1 and Scope 2  GHG emissions / Revenue from operations)</Text></View>
          <View style={{...styles.cell, width: "25.0%"}}><Text></Text></View>
          <View style={{...styles.cell, width: "25.0%"}}><Text></Text></View>
          <View style={{...styles.cell, width: "25.0%"}}><Text></Text></View>
        </View>
        <View style={styles.row}>
          <View style={{...styles.cell, width: "25.0%"}}><Text>Total Scope 1 and Scope 2 emission	intensity	per  rupee of turnover adjusted</Text></View>
          <View style={{...styles.cell, width: "25.0%"}}><Text></Text></View>
          <View style={{...styles.cell, width: "25.0%"}}><Text></Text></View>
          <View style={{...styles.cell, width: "25.0%"}}><Text></Text></View>
        </View>
        <View style={styles.row}>
          <View style={{...styles.cell, width: "25.0%"}}><Text>for Purchasing Power Parity (PPP)  (Total Scope 1 and Scope 2 GHG emissions / Revenue from operations adjusted for  PPP)</Text></View>
          <View style={{...styles.cell, width: "25.0%"}}><Text></Text></View>
          <View style={{...styles.cell, width: "25.0%"}}><Text></Text></View>
          <View style={{...styles.cell, width: "25.0%"}}><Text></Text></View>
        </View>
        <View style={styles.row}>
          <View style={{...styles.cell, width: "25.0%"}}><Text>Total Scope 1 and Scope 2 emission intensity in terms  of physical output</Text></View>
          <View style={{...styles.cell, width: "25.0%"}}><Text></Text></View>
          <View style={{...styles.cell, width: "25.0%"}}><Text></Text></View>
          <View style={{...styles.cell, width: "25.0%"}}><Text></Text></View>
        </View>
        <View style={styles.row}>
          <View style={{...styles.cell, width: "25.0%"}}><Text>Total Scope 1 and Scope 2 emission intensity (optional) – the relevant metric may be  selected by the entity</Text></View>
          <View style={{...styles.cell, width: "25.0%"}}><Text></Text></View>
          <View style={{...styles.cell, width: "25.0%"}}><Text></Text></View>
          <View style={{...styles.cell, width: "25.0%"}}><Text></Text></View>
        </View>
      </View>
      <Text style={styles.p}>Note: Indicate if any independent assessment/ evaluation/assurance has been carried out by an external agency? (Y/N) If yes, name of the external agency.</Text>
      <Text style={styles.p}>Does the entity have any project related to reducing Green House Gas emission? If Yes, then provide details.</Text>
      <Text style={styles.p}>Provide details related to waste management by the entity, in the following format:</Text>
      <View style={styles.table}>
        <View style={styles.row}>
          <View style={{...styles.cell, width: "33.333333333333336%"}}><Text>Parameter</Text></View>
          <View style={{...styles.cell, width: "33.333333333333336%"}}><Text>FY (2024-25) (Current Financial Year)</Text></View>
          <View style={{...styles.cell, width: "33.333333333333336%"}}><Text></Text></View>
        </View>
        <View style={styles.row}>
          <View style={{...styles.cell, width: "33.333333333333336%"}}><Text></Text></View>
          <View style={{...styles.cell, width: "33.333333333333336%"}}><Text></Text></View>
          <View style={{...styles.cell, width: "33.333333333333336%"}}><Text></Text></View>
        </View>
        <View style={styles.row}>
          <View style={{...styles.cell, width: "33.333333333333336%"}}><Text>Plastic waste (A)</Text></View>
          <View style={{...styles.cell, width: "33.333333333333336%"}}><Text>10.72</Text></View>
          <View style={{...styles.cell, width: "33.333333333333336%"}}><Text></Text></View>
        </View>
        <View style={styles.row}>
          <View style={{...styles.cell, width: "33.333333333333336%"}}><Text>E-waste (B)</Text></View>
          <View style={{...styles.cell, width: "33.333333333333336%"}}><Text>1.07</Text></View>
          <View style={{...styles.cell, width: "33.333333333333336%"}}><Text></Text></View>
        </View>
        <View style={styles.row}>
          <View style={{...styles.cell, width: "33.333333333333336%"}}><Text>Bio-medical waste (C)</Text></View>
          <View style={{...styles.cell, width: "33.333333333333336%"}}><Text>0.00</Text></View>
          <View style={{...styles.cell, width: "33.333333333333336%"}}><Text></Text></View>
        </View>
        <View style={styles.row}>
          <View style={{...styles.cell, width: "33.333333333333336%"}}><Text>Construction	and	demolition  waste (D)</Text></View>
          <View style={{...styles.cell, width: "33.333333333333336%"}}><Text>0.00</Text></View>
          <View style={{...styles.cell, width: "33.333333333333336%"}}><Text></Text></View>
        </View>
        <View style={styles.row}>
          <View style={{...styles.cell, width: "33.333333333333336%"}}><Text>Battery waste (E)</Text></View>
          <View style={{...styles.cell, width: "33.333333333333336%"}}><Text>0.00</Text></View>
          <View style={{...styles.cell, width: "33.333333333333336%"}}><Text></Text></View>
        </View>
        <View style={styles.row}>
          <View style={{...styles.cell, width: "33.333333333333336%"}}><Text>Radioactive waste (F)</Text></View>
          <View style={{...styles.cell, width: "33.333333333333336%"}}><Text>0.00</Text></View>
          <View style={{...styles.cell, width: "33.333333333333336%"}}><Text></Text></View>
        </View>
        <View style={styles.row}>
          <View style={{...styles.cell, width: "33.333333333333336%"}}><Text>Other Hazardous waste. Please  specify, if any. (G)</Text></View>
          <View style={{...styles.cell, width: "33.333333333333336%"}}><Text>195.88</Text></View>
          <View style={{...styles.cell, width: "33.333333333333336%"}}><Text></Text></View>
        </View>
        <View style={styles.row}>
          <View style={{...styles.cell, width: "33.333333333333336%"}}><Text>Other Non-hazardous waste generated (H). Please specify, if any.  (Break-up by composition i.e. by  materials relevant to the sector)</Text></View>
          <View style={{...styles.cell, width: "33.333333333333336%"}}><Text>614.90</Text></View>
          <View style={{...styles.cell, width: "33.333333333333336%"}}><Text></Text></View>
        </View>
        <View style={styles.row}>
          <View style={{...styles.cell, width: "33.333333333333336%"}}><Text>Total (A+B + C + D + E + F + G  + H)</Text></View>
          <View style={{...styles.cell, width: "33.333333333333336%"}}><Text>68.11</Text></View>
          <View style={{...styles.cell, width: "33.333333333333336%"}}><Text></Text></View>
        </View>
        <View style={styles.row}>
          <View style={{...styles.cell, width: "33.333333333333336%"}}><Text>Waste intensity per rupee of turnover  (Total	waste	generated	/  Revenue from operations)</Text></View>
          <View style={{...styles.cell, width: "33.333333333333336%"}}><Text></Text></View>
          <View style={{...styles.cell, width: "33.333333333333336%"}}><Text></Text></View>
        </View>
        <View style={styles.row}>
          <View style={{...styles.cell, width: "33.333333333333336%"}}><Text>Waste intensity per rupee of turnover adjusted for Purchasing Power Parity (PPP)  (Total waste generated / Revenue   from   operations  adjusted for PPP)</Text></View>
          <View style={{...styles.cell, width: "33.333333333333336%"}}><Text></Text></View>
          <View style={{...styles.cell, width: "33.333333333333336%"}}><Text></Text></View>
        </View>
        <View style={styles.row}>
          <View style={{...styles.cell, width: "33.333333333333336%"}}><Text>Waste intensity in terms of  physical output</Text></View>
          <View style={{...styles.cell, width: "33.333333333333336%"}}><Text></Text></View>
          <View style={{...styles.cell, width: "33.333333333333336%"}}><Text></Text></View>
        </View>
        <View style={styles.row}>
          <View style={{...styles.cell, width: "33.333333333333336%"}}><Text>Waste intensity (optional) – the relevant metric may be  selected by the entity</Text></View>
          <View style={{...styles.cell, width: "33.333333333333336%"}}><Text></Text></View>
          <View style={{...styles.cell, width: "33.333333333333336%"}}><Text></Text></View>
        </View>
        <View style={styles.row}>
          <View style={{...styles.cell, width: "33.333333333333336%"}}><Text></Text></View>
          <View style={{...styles.cell, width: "33.333333333333336%"}}><Text></Text></View>
          <View style={{...styles.cell, width: "33.333333333333336%"}}><Text></Text></View>
        </View>
        <View style={styles.row}>
          <View style={{...styles.cell, width: "33.333333333333336%"}}><Text></Text></View>
          <View style={{...styles.cell, width: "33.333333333333336%"}}><Text></Text></View>
          <View style={{...styles.cell, width: "33.333333333333336%"}}><Text></Text></View>
        </View>
        <View style={styles.row}>
          <View style={{...styles.cell, width: "33.333333333333336%"}}><Text>(i) Recycled</Text></View>
          <View style={{...styles.cell, width: "33.333333333333336%"}}><Text>115.83</Text></View>
          <View style={{...styles.cell, width: "33.333333333333336%"}}><Text></Text></View>
        </View>
        <View style={styles.row}>
          <View style={{...styles.cell, width: "33.333333333333336%"}}><Text>(ii) Re-used</Text></View>
          <View style={{...styles.cell, width: "33.333333333333336%"}}><Text></Text></View>
          <View style={{...styles.cell, width: "33.333333333333336%"}}><Text></Text></View>
        </View>
        <View style={styles.row}>
          <View style={{...styles.cell, width: "33.333333333333336%"}}><Text>(iii) Other recovery operations</Text></View>
          <View style={{...styles.cell, width: "33.333333333333336%"}}><Text></Text></View>
          <View style={{...styles.cell, width: "33.333333333333336%"}}><Text></Text></View>
        </View>
        <View style={styles.row}>
          <View style={{...styles.cell, width: "33.333333333333336%"}}><Text>Total</Text></View>
          <View style={{...styles.cell, width: "33.333333333333336%"}}><Text>115.83</Text></View>
          <View style={{...styles.cell, width: "33.333333333333336%"}}><Text></Text></View>
        </View>
        <View style={styles.row}>
          <View style={{...styles.cell, width: "33.333333333333336%"}}><Text></Text></View>
          <View style={{...styles.cell, width: "33.333333333333336%"}}><Text></Text></View>
          <View style={{...styles.cell, width: "33.333333333333336%"}}><Text></Text></View>
        </View>
        <View style={styles.row}>
          <View style={{...styles.cell, width: "33.333333333333336%"}}><Text>Category of waste</Text></View>
          <View style={{...styles.cell, width: "33.333333333333336%"}}><Text></Text></View>
          <View style={{...styles.cell, width: "33.333333333333336%"}}><Text></Text></View>
        </View>
        <View style={styles.row}>
          <View style={{...styles.cell, width: "33.333333333333336%"}}><Text>(i) Incineration</Text></View>
          <View style={{...styles.cell, width: "33.333333333333336%"}}><Text>0.00</Text></View>
          <View style={{...styles.cell, width: "33.333333333333336%"}}><Text></Text></View>
        </View>
        <View style={styles.row}>
          <View style={{...styles.cell, width: "33.333333333333336%"}}><Text>(ii) Landfilling</Text></View>
          <View style={{...styles.cell, width: "33.333333333333336%"}}><Text>0.00</Text></View>
          <View style={{...styles.cell, width: "33.333333333333336%"}}><Text></Text></View>
        </View>
        <View style={styles.row}>
          <View style={{...styles.cell, width: "33.333333333333336%"}}><Text>(iii) Other disposal operations</Text></View>
          <View style={{...styles.cell, width: "33.333333333333336%"}}><Text>229.85</Text></View>
          <View style={{...styles.cell, width: "33.333333333333336%"}}><Text></Text></View>
        </View>
        <View style={styles.row}>
          <View style={{...styles.cell, width: "33.333333333333336%"}}><Text>Total</Text></View>
          <View style={{...styles.cell, width: "33.333333333333336%"}}><Text>229.85</Text></View>
          <View style={{...styles.cell, width: "33.333333333333336%"}}><Text></Text></View>
        </View>
      </View>
      <Text style={styles.p}>Note: Indicate if any independent assessment/ evaluation/assurance has been carried out by an external agency? (Y/N) If yes, name of the external agency.</Text>
      <Text style={styles.p}>Briefly describe the waste management practices adopted in your establishments. Describe the strategy adopted by your company to reduce usage of hazardous and toxic chemicals in your products and processes and the practices adopted to manage such wastes.</Text>
      <Text style={styles.p}>As per ISO 14001: 2015, Waste Disposal SOP document no. HEO810000010. Optimization of Hazardous waste generation during manufacturing process and being dispose through register recycler or co-processor.</Text>
      <Text style={styles.p}>If the entity has operations/offices in/around ecologically sensitive areas (such as national parks, wildlife sanctuaries, biosphere reserves, wetlands, biodiversity hotspots, forests coastal regulation zones etc.) where environmental approvals / clearances are required, please specify details in the following format:</Text>
      <View style={styles.table}>
        <View style={styles.row}>
          <View style={{...styles.cell, width: "25.0%"}}><Text>S. No.</Text></View>
          <View style={{...styles.cell, width: "25.0%"}}><Text>Location of operations/offices</Text></View>
          <View style={{...styles.cell, width: "25.0%"}}><Text></Text></View>
          <View style={{...styles.cell, width: "25.0%"}}><Text></Text></View>
        </View>
        <View style={styles.row}>
          <View style={{...styles.cell, width: "25.0%"}}><Text></Text></View>
          <View style={{...styles.cell, width: "25.0%"}}><Text>NA</Text></View>
          <View style={{...styles.cell, width: "25.0%"}}><Text></Text></View>
          <View style={{...styles.cell, width: "25.0%"}}><Text></Text></View>
        </View>
        <View style={styles.row}>
          <View style={{...styles.cell, width: "25.0%"}}><Text></Text></View>
          <View style={{...styles.cell, width: "25.0%"}}><Text></Text></View>
          <View style={{...styles.cell, width: "25.0%"}}><Text></Text></View>
          <View style={{...styles.cell, width: "25.0%"}}><Text></Text></View>
        </View>
      </View>
      <Text style={styles.p}>Details of environmental impact assessments of projects undertaken by the entity based on applicable laws, in the current financial year:</Text>
      <View style={styles.table}>
        <View style={styles.row}>
          <View style={{...styles.cell, width: "16.666666666666668%"}}><Text>Name and brief details of  project</Text></View>
          <View style={{...styles.cell, width: "16.666666666666668%"}}><Text>EIA  Notification  No.</Text></View>
          <View style={{...styles.cell, width: "16.666666666666668%"}}><Text></Text></View>
          <View style={{...styles.cell, width: "16.666666666666668%"}}><Text></Text></View>
          <View style={{...styles.cell, width: "16.666666666666668%"}}><Text></Text></View>
          <View style={{...styles.cell, width: "16.666666666666668%"}}><Text></Text></View>
        </View>
        <View style={styles.row}>
          <View style={{...styles.cell, width: "16.666666666666668%"}}><Text>NA</Text></View>
          <View style={{...styles.cell, width: "16.666666666666668%"}}><Text>NA</Text></View>
          <View style={{...styles.cell, width: "16.666666666666668%"}}><Text></Text></View>
          <View style={{...styles.cell, width: "16.666666666666668%"}}><Text></Text></View>
          <View style={{...styles.cell, width: "16.666666666666668%"}}><Text></Text></View>
          <View style={{...styles.cell, width: "16.666666666666668%"}}><Text></Text></View>
        </View>
        <View style={styles.row}>
          <View style={{...styles.cell, width: "16.666666666666668%"}}><Text></Text></View>
          <View style={{...styles.cell, width: "16.666666666666668%"}}><Text></Text></View>
          <View style={{...styles.cell, width: "16.666666666666668%"}}><Text></Text></View>
          <View style={{...styles.cell, width: "16.666666666666668%"}}><Text></Text></View>
          <View style={{...styles.cell, width: "16.666666666666668%"}}><Text></Text></View>
          <View style={{...styles.cell, width: "16.666666666666668%"}}><Text></Text></View>
        </View>
      </View>
      <Text style={styles.p}>Is the entity compliant with the applicable environmental law/ regulations/ guidelines in India; such as the Water (Prevention and Control of Pollution) Act, Air (Prevention and Control of Pollution) Act, Environment protection act and rules thereunder (Y/N). If not, provide details of all such non-compliances, in the following format:</Text>
      <Text style={styles.p}>Yes</Text>
      <View style={styles.table}>
        <View style={styles.row}>
          <View style={{...styles.cell, width: "20.0%"}}><Text>S. No.</Text></View>
          <View style={{...styles.cell, width: "20.0%"}}><Text>Specify the law / regulation	/ guidelines which was not complied with</Text></View>
          <View style={{...styles.cell, width: "20.0%"}}><Text></Text></View>
          <View style={{...styles.cell, width: "20.0%"}}><Text></Text></View>
          <View style={{...styles.cell, width: "20.0%"}}><Text></Text></View>
        </View>
        <View style={styles.row}>
          <View style={{...styles.cell, width: "20.0%"}}><Text></Text></View>
          <View style={{...styles.cell, width: "20.0%"}}><Text></Text></View>
          <View style={{...styles.cell, width: "20.0%"}}><Text></Text></View>
          <View style={{...styles.cell, width: "20.0%"}}><Text></Text></View>
          <View style={{...styles.cell, width: "20.0%"}}><Text></Text></View>
        </View>
        <View style={styles.row}>
          <View style={{...styles.cell, width: "20.0%"}}><Text></Text></View>
          <View style={{...styles.cell, width: "20.0%"}}><Text></Text></View>
          <View style={{...styles.cell, width: "20.0%"}}><Text></Text></View>
          <View style={{...styles.cell, width: "20.0%"}}><Text></Text></View>
          <View style={{...styles.cell, width: "20.0%"}}><Text></Text></View>
        </View>
      </View>
      <Text style={styles.p}>Leadership Indicators</Text>
      <Text style={styles.p}>Water withdrawal, consumption and discharge in areas of water stress (in kilolitres):</Text>
      <Text style={styles.p}>For each facility / plant located in areas of water stress, provide the following information:</Text>
      <Text style={styles.p}>Name of the area</Text>
      <Text style={styles.p}>Nature of operations</Text>
      <Text style={styles.p}>Water withdrawal, consumption and discharge in the following format:</Text>
      <View style={styles.table}>
        <View style={styles.row}>
          <View style={{...styles.cell, width: "33.333333333333336%"}}><Text>Parameter</Text></View>
          <View style={{...styles.cell, width: "33.333333333333336%"}}><Text>FY (2024-25)   (Current Financial Year)</Text></View>
          <View style={{...styles.cell, width: "33.333333333333336%"}}><Text></Text></View>
        </View>
        <View style={styles.row}>
          <View style={{...styles.cell, width: "33.333333333333336%"}}><Text></Text></View>
          <View style={{...styles.cell, width: "33.333333333333336%"}}><Text></Text></View>
          <View style={{...styles.cell, width: "33.333333333333336%"}}><Text></Text></View>
        </View>
        <View style={styles.row}>
          <View style={{...styles.cell, width: "33.333333333333336%"}}><Text>(i) Surface water</Text></View>
          <View style={{...styles.cell, width: "33.333333333333336%"}}><Text>NA</Text></View>
          <View style={{...styles.cell, width: "33.333333333333336%"}}><Text></Text></View>
        </View>
        <View style={styles.row}>
          <View style={{...styles.cell, width: "33.333333333333336%"}}><Text>(ii) Groundwater</Text></View>
          <View style={{...styles.cell, width: "33.333333333333336%"}}><Text>NA</Text></View>
          <View style={{...styles.cell, width: "33.333333333333336%"}}><Text></Text></View>
        </View>
        <View style={styles.row}>
          <View style={{...styles.cell, width: "33.333333333333336%"}}><Text>(iii) Third party water</Text></View>
          <View style={{...styles.cell, width: "33.333333333333336%"}}><Text>NA</Text></View>
          <View style={{...styles.cell, width: "33.333333333333336%"}}><Text></Text></View>
        </View>
        <View style={styles.row}>
          <View style={{...styles.cell, width: "33.333333333333336%"}}><Text>(iv) Seawater / desalinated water</Text></View>
          <View style={{...styles.cell, width: "33.333333333333336%"}}><Text>NA</Text></View>
          <View style={{...styles.cell, width: "33.333333333333336%"}}><Text></Text></View>
        </View>
        <View style={styles.row}>
          <View style={{...styles.cell, width: "33.333333333333336%"}}><Text>(v) Others</Text></View>
          <View style={{...styles.cell, width: "33.333333333333336%"}}><Text>NA</Text></View>
          <View style={{...styles.cell, width: "33.333333333333336%"}}><Text></Text></View>
        </View>
        <View style={styles.row}>
          <View style={{...styles.cell, width: "33.333333333333336%"}}><Text>Total volume of water withdrawal (in  kilolitres)</Text></View>
          <View style={{...styles.cell, width: "33.333333333333336%"}}><Text>NA</Text></View>
          <View style={{...styles.cell, width: "33.333333333333336%"}}><Text></Text></View>
        </View>
        <View style={styles.row}>
          <View style={{...styles.cell, width: "33.333333333333336%"}}><Text>Total volume of water consumption  (in kilolitres)</Text></View>
          <View style={{...styles.cell, width: "33.333333333333336%"}}><Text>NA</Text></View>
          <View style={{...styles.cell, width: "33.333333333333336%"}}><Text></Text></View>
        </View>
        <View style={styles.row}>
          <View style={{...styles.cell, width: "33.333333333333336%"}}><Text>Water intensity per rupee of turnover  (Water consumed / turnover)</Text></View>
          <View style={{...styles.cell, width: "33.333333333333336%"}}><Text>NA</Text></View>
          <View style={{...styles.cell, width: "33.333333333333336%"}}><Text></Text></View>
        </View>
        <View style={styles.row}>
          <View style={{...styles.cell, width: "33.333333333333336%"}}><Text>Water	intensity	(optional)	–	the  relevant metric may be selected by the entity</Text></View>
          <View style={{...styles.cell, width: "33.333333333333336%"}}><Text>NA</Text></View>
          <View style={{...styles.cell, width: "33.333333333333336%"}}><Text></Text></View>
        </View>
        <View style={styles.row}>
          <View style={{...styles.cell, width: "33.333333333333336%"}}><Text></Text></View>
          <View style={{...styles.cell, width: "33.333333333333336%"}}><Text></Text></View>
          <View style={{...styles.cell, width: "33.333333333333336%"}}><Text></Text></View>
        </View>
        <View style={styles.row}>
          <View style={{...styles.cell, width: "33.333333333333336%"}}><Text>(i) Into Surface water</Text></View>
          <View style={{...styles.cell, width: "33.333333333333336%"}}><Text>NA</Text></View>
          <View style={{...styles.cell, width: "33.333333333333336%"}}><Text></Text></View>
        </View>
        <View style={styles.row}>
          <View style={{...styles.cell, width: "33.333333333333336%"}}><Text>-	No treatment</Text></View>
          <View style={{...styles.cell, width: "33.333333333333336%"}}><Text>NA</Text></View>
          <View style={{...styles.cell, width: "33.333333333333336%"}}><Text></Text></View>
        </View>
        <View style={styles.row}>
          <View style={{...styles.cell, width: "33.333333333333336%"}}><Text>-	With treatment – please specify  level of treatment</Text></View>
          <View style={{...styles.cell, width: "33.333333333333336%"}}><Text>NA</Text></View>
          <View style={{...styles.cell, width: "33.333333333333336%"}}><Text></Text></View>
        </View>
        <View style={styles.row}>
          <View style={{...styles.cell, width: "33.333333333333336%"}}><Text>(ii) Into Groundwater</Text></View>
          <View style={{...styles.cell, width: "33.333333333333336%"}}><Text>NA</Text></View>
          <View style={{...styles.cell, width: "33.333333333333336%"}}><Text></Text></View>
        </View>
        <View style={styles.row}>
          <View style={{...styles.cell, width: "33.333333333333336%"}}><Text>-	No treatment</Text></View>
          <View style={{...styles.cell, width: "33.333333333333336%"}}><Text>NA</Text></View>
          <View style={{...styles.cell, width: "33.333333333333336%"}}><Text></Text></View>
        </View>
        <View style={styles.row}>
          <View style={{...styles.cell, width: "33.333333333333336%"}}><Text>-	With treatment – please specify  level of treatment</Text></View>
          <View style={{...styles.cell, width: "33.333333333333336%"}}><Text>NA</Text></View>
          <View style={{...styles.cell, width: "33.333333333333336%"}}><Text></Text></View>
        </View>
        <View style={styles.row}>
          <View style={{...styles.cell, width: "33.333333333333336%"}}><Text>(iii) Into Seawater</Text></View>
          <View style={{...styles.cell, width: "33.333333333333336%"}}><Text>NA</Text></View>
          <View style={{...styles.cell, width: "33.333333333333336%"}}><Text></Text></View>
        </View>
        <View style={styles.row}>
          <View style={{...styles.cell, width: "33.333333333333336%"}}><Text>-	No treatment</Text></View>
          <View style={{...styles.cell, width: "33.333333333333336%"}}><Text>NA</Text></View>
          <View style={{...styles.cell, width: "33.333333333333336%"}}><Text></Text></View>
        </View>
        <View style={styles.row}>
          <View style={{...styles.cell, width: "33.333333333333336%"}}><Text>-	With treatment – please specify  level of treatment</Text></View>
          <View style={{...styles.cell, width: "33.333333333333336%"}}><Text>NA</Text></View>
          <View style={{...styles.cell, width: "33.333333333333336%"}}><Text></Text></View>
        </View>
        <View style={styles.row}>
          <View style={{...styles.cell, width: "33.333333333333336%"}}><Text>(iv) Sent to third-parties</Text></View>
          <View style={{...styles.cell, width: "33.333333333333336%"}}><Text>NA</Text></View>
          <View style={{...styles.cell, width: "33.333333333333336%"}}><Text></Text></View>
        </View>
        <View style={styles.row}>
          <View style={{...styles.cell, width: "33.333333333333336%"}}><Text>-	No treatment</Text></View>
          <View style={{...styles.cell, width: "33.333333333333336%"}}><Text>NA</Text></View>
          <View style={{...styles.cell, width: "33.333333333333336%"}}><Text></Text></View>
        </View>
        <View style={styles.row}>
          <View style={{...styles.cell, width: "33.333333333333336%"}}><Text>-	With treatment – please specify  level of treatment</Text></View>
          <View style={{...styles.cell, width: "33.333333333333336%"}}><Text>NA</Text></View>
          <View style={{...styles.cell, width: "33.333333333333336%"}}><Text></Text></View>
        </View>
        <View style={styles.row}>
          <View style={{...styles.cell, width: "33.333333333333336%"}}><Text>(v) Others</Text></View>
          <View style={{...styles.cell, width: "33.333333333333336%"}}><Text>NA</Text></View>
          <View style={{...styles.cell, width: "33.333333333333336%"}}><Text></Text></View>
        </View>
        <View style={styles.row}>
          <View style={{...styles.cell, width: "33.333333333333336%"}}><Text>-	No treatment</Text></View>
          <View style={{...styles.cell, width: "33.333333333333336%"}}><Text>NA</Text></View>
          <View style={{...styles.cell, width: "33.333333333333336%"}}><Text></Text></View>
        </View>
        <View style={styles.row}>
          <View style={{...styles.cell, width: "33.333333333333336%"}}><Text>-	With treatment – please specify  level of treatment</Text></View>
          <View style={{...styles.cell, width: "33.333333333333336%"}}><Text>NA</Text></View>
          <View style={{...styles.cell, width: "33.333333333333336%"}}><Text></Text></View>
        </View>
        <View style={styles.row}>
          <View style={{...styles.cell, width: "33.333333333333336%"}}><Text>Total water discharged (in kilolitres)</Text></View>
          <View style={{...styles.cell, width: "33.333333333333336%"}}><Text>NA</Text></View>
          <View style={{...styles.cell, width: "33.333333333333336%"}}><Text></Text></View>
        </View>
      </View>
      <Text style={styles.p}>Note: Indicate if any independent assessment/ evaluation/assurance has been carried out by an external agency? (Y/N) If yes, name of the external agency.</Text>
      <Text style={styles.p}>Not applicable, as the Company does not operate around ecologically sensitive areas.</Text>
      <Text style={styles.p}>Please provide details of total Scope 3 emissions &amp; its intensity, in the following format:</Text>
      <View style={styles.table}>
        <View style={styles.row}>
          <View style={{...styles.cell, width: "25.0%"}}><Text>Parameter</Text></View>
          <View style={{...styles.cell, width: "25.0%"}}><Text>Unit</Text></View>
          <View style={{...styles.cell, width: "25.0%"}}><Text></Text></View>
          <View style={{...styles.cell, width: "25.0%"}}><Text></Text></View>
        </View>
        <View style={styles.row}>
          <View style={{...styles.cell, width: "25.0%"}}><Text>Total Scope 3 emissions (Break-up of the GHG into CO2, CH4, N2O, HFCs, PFCs,  SF6, NF3, if available)</Text></View>
          <View style={{...styles.cell, width: "25.0%"}}><Text>Metric tonnes of CO2  equivalent</Text></View>
          <View style={{...styles.cell, width: "25.0%"}}><Text></Text></View>
          <View style={{...styles.cell, width: "25.0%"}}><Text></Text></View>
        </View>
        <View style={styles.row}>
          <View style={{...styles.cell, width: "25.0%"}}><Text>Total Scope 3 emissions  per rupee of turnover</Text></View>
          <View style={{...styles.cell, width: "25.0%"}}><Text>Metric tonnes of CO2  equivalent /Turnover   (in Crore Rs.)</Text></View>
          <View style={{...styles.cell, width: "25.0%"}}><Text></Text></View>
          <View style={{...styles.cell, width: "25.0%"}}><Text></Text></View>
        </View>
        <View style={styles.row}>
          <View style={{...styles.cell, width: "25.0%"}}><Text>Total Scope 3 emission intensity (optional) – the relevant metric may be  selected by the entity</Text></View>
          <View style={{...styles.cell, width: "25.0%"}}><Text></Text></View>
          <View style={{...styles.cell, width: "25.0%"}}><Text></Text></View>
          <View style={{...styles.cell, width: "25.0%"}}><Text></Text></View>
        </View>
      </View>
      <Text style={styles.p}>Note: Indicate if any independent assessment/ evaluation/assurance has been carried out by an external agency? (Y/N) If yes, name of the external agency.</Text>
      <Text style={styles.p}>With respect to the ecologically sensitive areas reported at Question 11 of Essential Indicators above, provide details of significant direct &amp; indirect impact of the entity on biodiversity in such areas along-with prevention and remediation activities.</Text>
      <Text style={styles.p}>Not applicable, as the Company does not operate around ecologically sensitive areas.</Text>
      <Text style={styles.p}>If the entity has undertaken any specific initiatives or used innovative technology or solutions to improve resource efficiency, or reduce impact due to emissions / effluent discharge / waste generated, please provide details of the same as well as outcome of such initiatives, as per the following format:</Text>
      <View style={styles.table}>
        <View style={styles.row}>
          <View style={{...styles.cell, width: "25.0%"}}><Text>Sr. No</Text></View>
          <View style={{...styles.cell, width: "25.0%"}}><Text>Initiative undertaken</Text></View>
          <View style={{...styles.cell, width: "25.0%"}}><Text></Text></View>
          <View style={{...styles.cell, width: "25.0%"}}><Text></Text></View>
        </View>
        <View style={styles.row}>
          <View style={{...styles.cell, width: "25.0%"}}><Text></Text></View>
          <View style={{...styles.cell, width: "25.0%"}}><Text></Text></View>
          <View style={{...styles.cell, width: "25.0%"}}><Text></Text></View>
          <View style={{...styles.cell, width: "25.0%"}}><Text></Text></View>
        </View>
      </View>
      <Text style={styles.p}>Does the entity have a business continuity and disaster management plan? Give details in 100 words/ web link.</Text>
      <Text style={styles.p}>Disclose any significant adverse impact to the environment, arising from the value chain of the entity. What mitigation or adaptation measures have been taken by the entity in this regard.</Text>
      <Text style={styles.p}>Percentage of value chain partners (by value of business done with such partners) that were assessed for environmental impacts.</Text>
      <Text style={styles.p}>Essential Indicators</Text>
      <Text style={styles.p}>1.  a. Number of affiliations with trade and industry chambers/ associations.</Text>
      <Text style={styles.p}>b. List the top 10 trade and industry chambers/ associations (determined based on the total members of such body) the entity is a member of/ affiliated to.</Text>
      <View style={styles.table}>
        <View style={styles.row}>
          <View style={{...styles.cell, width: "33.333333333333336%"}}><Text>S. No.</Text></View>
          <View style={{...styles.cell, width: "33.333333333333336%"}}><Text>Name of the trade and industry chambers/ associations</Text></View>
          <View style={{...styles.cell, width: "33.333333333333336%"}}><Text></Text></View>
        </View>
        <View style={styles.row}>
          <View style={{...styles.cell, width: "33.333333333333336%"}}><Text>1</Text></View>
          <View style={{...styles.cell, width: "33.333333333333336%"}}><Text>GCCI</Text></View>
          <View style={{...styles.cell, width: "33.333333333333336%"}}><Text></Text></View>
        </View>
        <View style={styles.row}>
          <View style={{...styles.cell, width: "33.333333333333336%"}}><Text>2</Text></View>
          <View style={{...styles.cell, width: "33.333333333333336%"}}><Text>CII</Text></View>
          <View style={{...styles.cell, width: "33.333333333333336%"}}><Text></Text></View>
        </View>
        <View style={styles.row}>
          <View style={{...styles.cell, width: "33.333333333333336%"}}><Text>3</Text></View>
          <View style={{...styles.cell, width: "33.333333333333336%"}}><Text>AMA</Text></View>
          <View style={{...styles.cell, width: "33.333333333333336%"}}><Text></Text></View>
        </View>
        <View style={styles.row}>
          <View style={{...styles.cell, width: "33.333333333333336%"}}><Text>4</Text></View>
          <View style={{...styles.cell, width: "33.333333333333336%"}}><Text>ACMA</Text></View>
          <View style={{...styles.cell, width: "33.333333333333336%"}}><Text></Text></View>
        </View>
        <View style={styles.row}>
          <View style={{...styles.cell, width: "33.333333333333336%"}}><Text>5</Text></View>
          <View style={{...styles.cell, width: "33.333333333333336%"}}><Text></Text></View>
          <View style={{...styles.cell, width: "33.333333333333336%"}}><Text></Text></View>
        </View>
        <View style={styles.row}>
          <View style={{...styles.cell, width: "33.333333333333336%"}}><Text>6</Text></View>
          <View style={{...styles.cell, width: "33.333333333333336%"}}><Text></Text></View>
          <View style={{...styles.cell, width: "33.333333333333336%"}}><Text></Text></View>
        </View>
        <View style={styles.row}>
          <View style={{...styles.cell, width: "33.333333333333336%"}}><Text>7</Text></View>
          <View style={{...styles.cell, width: "33.333333333333336%"}}><Text></Text></View>
          <View style={{...styles.cell, width: "33.333333333333336%"}}><Text></Text></View>
        </View>
        <View style={styles.row}>
          <View style={{...styles.cell, width: "33.333333333333336%"}}><Text>8</Text></View>
          <View style={{...styles.cell, width: "33.333333333333336%"}}><Text></Text></View>
          <View style={{...styles.cell, width: "33.333333333333336%"}}><Text></Text></View>
        </View>
        <View style={styles.row}>
          <View style={{...styles.cell, width: "33.333333333333336%"}}><Text>9</Text></View>
          <View style={{...styles.cell, width: "33.333333333333336%"}}><Text></Text></View>
          <View style={{...styles.cell, width: "33.333333333333336%"}}><Text></Text></View>
        </View>
        <View style={styles.row}>
          <View style={{...styles.cell, width: "33.333333333333336%"}}><Text>10</Text></View>
          <View style={{...styles.cell, width: "33.333333333333336%"}}><Text></Text></View>
          <View style={{...styles.cell, width: "33.333333333333336%"}}><Text></Text></View>
        </View>
      </View>
      <Text style={styles.p}>2. Provide details of corrective action taken or underway on any issues related to anti- competitive conduct by the entity, based on adverse orders from regulatory authorities.</Text>
      <View style={styles.table}>
        <View style={styles.row}>
          <View style={{...styles.cell, width: "33.333333333333336%"}}><Text>Name of authority</Text></View>
          <View style={{...styles.cell, width: "33.333333333333336%"}}><Text>Brief of the case</Text></View>
          <View style={{...styles.cell, width: "33.333333333333336%"}}><Text></Text></View>
        </View>
        <View style={styles.row}>
          <View style={{...styles.cell, width: "33.333333333333336%"}}><Text></Text></View>
          <View style={{...styles.cell, width: "33.333333333333336%"}}><Text>Nil</Text></View>
          <View style={{...styles.cell, width: "33.333333333333336%"}}><Text></Text></View>
        </View>
        <View style={styles.row}>
          <View style={{...styles.cell, width: "33.333333333333336%"}}><Text></Text></View>
          <View style={{...styles.cell, width: "33.333333333333336%"}}><Text></Text></View>
          <View style={{...styles.cell, width: "33.333333333333336%"}}><Text></Text></View>
        </View>
      </View>
      <Text style={styles.p}>Leadership Indicators</Text>
      <Text style={styles.p}>1.  Details of public policy positions advocated by the entity:</Text>
      <View style={styles.table}>
        <View style={styles.row}>
          <View style={{...styles.cell, width: "16.666666666666668%"}}><Text>S. No.</Text></View>
          <View style={{...styles.cell, width: "16.666666666666668%"}}><Text>Public  Policy  advocated</Text></View>
          <View style={{...styles.cell, width: "16.666666666666668%"}}><Text></Text></View>
          <View style={{...styles.cell, width: "16.666666666666668%"}}><Text></Text></View>
          <View style={{...styles.cell, width: "16.666666666666668%"}}><Text></Text></View>
          <View style={{...styles.cell, width: "16.666666666666668%"}}><Text></Text></View>
        </View>
        <View style={styles.row}>
          <View style={{...styles.cell, width: "16.666666666666668%"}}><Text></Text></View>
          <View style={{...styles.cell, width: "16.666666666666668%"}}><Text></Text></View>
          <View style={{...styles.cell, width: "16.666666666666668%"}}><Text></Text></View>
          <View style={{...styles.cell, width: "16.666666666666668%"}}><Text></Text></View>
          <View style={{...styles.cell, width: "16.666666666666668%"}}><Text></Text></View>
          <View style={{...styles.cell, width: "16.666666666666668%"}}><Text></Text></View>
        </View>
      </View>
      <Text style={styles.p}>Essential Indicators</Text>
      <Text style={styles.p}>Details of Social Impact Assessments (SIA) of projects undertaken by the entity based on applicable laws, in the current financial year:</Text>
      <View style={styles.table}>
        <View style={styles.row}>
          <View style={{...styles.cell, width: "16.666666666666668%"}}><Text>Name and  brief</Text></View>
          <View style={{...styles.cell, width: "16.666666666666668%"}}><Text>SIA</Text></View>
          <View style={{...styles.cell, width: "16.666666666666668%"}}><Text></Text></View>
          <View style={{...styles.cell, width: "16.666666666666668%"}}><Text></Text></View>
          <View style={{...styles.cell, width: "16.666666666666668%"}}><Text></Text></View>
          <View style={{...styles.cell, width: "16.666666666666668%"}}><Text></Text></View>
        </View>
        <View style={styles.row}>
          <View style={{...styles.cell, width: "16.666666666666668%"}}><Text>details of project</Text></View>
          <View style={{...styles.cell, width: "16.666666666666668%"}}><Text>Notification</Text></View>
          <View style={{...styles.cell, width: "16.666666666666668%"}}><Text></Text></View>
          <View style={{...styles.cell, width: "16.666666666666668%"}}><Text></Text></View>
          <View style={{...styles.cell, width: "16.666666666666668%"}}><Text></Text></View>
          <View style={{...styles.cell, width: "16.666666666666668%"}}><Text></Text></View>
        </View>
        <View style={styles.row}>
          <View style={{...styles.cell, width: "16.666666666666668%"}}><Text></Text></View>
          <View style={{...styles.cell, width: "16.666666666666668%"}}><Text>No.</Text></View>
          <View style={{...styles.cell, width: "16.666666666666668%"}}><Text></Text></View>
          <View style={{...styles.cell, width: "16.666666666666668%"}}><Text></Text></View>
          <View style={{...styles.cell, width: "16.666666666666668%"}}><Text></Text></View>
          <View style={{...styles.cell, width: "16.666666666666668%"}}><Text></Text></View>
        </View>
        <View style={styles.row}>
          <View style={{...styles.cell, width: "16.666666666666668%"}}><Text></Text></View>
          <View style={{...styles.cell, width: "16.666666666666668%"}}><Text></Text></View>
          <View style={{...styles.cell, width: "16.666666666666668%"}}><Text></Text></View>
          <View style={{...styles.cell, width: "16.666666666666668%"}}><Text></Text></View>
          <View style={{...styles.cell, width: "16.666666666666668%"}}><Text></Text></View>
          <View style={{...styles.cell, width: "16.666666666666668%"}}><Text></Text></View>
        </View>
        <View style={styles.row}>
          <View style={{...styles.cell, width: "16.666666666666668%"}}><Text></Text></View>
          <View style={{...styles.cell, width: "16.666666666666668%"}}><Text></Text></View>
          <View style={{...styles.cell, width: "16.666666666666668%"}}><Text></Text></View>
          <View style={{...styles.cell, width: "16.666666666666668%"}}><Text></Text></View>
          <View style={{...styles.cell, width: "16.666666666666668%"}}><Text></Text></View>
          <View style={{...styles.cell, width: "16.666666666666668%"}}><Text></Text></View>
        </View>
        <View style={styles.row}>
          <View style={{...styles.cell, width: "16.666666666666668%"}}><Text></Text></View>
          <View style={{...styles.cell, width: "16.666666666666668%"}}><Text></Text></View>
          <View style={{...styles.cell, width: "16.666666666666668%"}}><Text></Text></View>
          <View style={{...styles.cell, width: "16.666666666666668%"}}><Text></Text></View>
          <View style={{...styles.cell, width: "16.666666666666668%"}}><Text></Text></View>
          <View style={{...styles.cell, width: "16.666666666666668%"}}><Text></Text></View>
        </View>
        <View style={styles.row}>
          <View style={{...styles.cell, width: "16.666666666666668%"}}><Text></Text></View>
          <View style={{...styles.cell, width: "16.666666666666668%"}}><Text></Text></View>
          <View style={{...styles.cell, width: "16.666666666666668%"}}><Text></Text></View>
          <View style={{...styles.cell, width: "16.666666666666668%"}}><Text></Text></View>
          <View style={{...styles.cell, width: "16.666666666666668%"}}><Text></Text></View>
          <View style={{...styles.cell, width: "16.666666666666668%"}}><Text></Text></View>
        </View>
        <View style={styles.row}>
          <View style={{...styles.cell, width: "16.666666666666668%"}}><Text></Text></View>
          <View style={{...styles.cell, width: "16.666666666666668%"}}><Text></Text></View>
          <View style={{...styles.cell, width: "16.666666666666668%"}}><Text></Text></View>
          <View style={{...styles.cell, width: "16.666666666666668%"}}><Text></Text></View>
          <View style={{...styles.cell, width: "16.666666666666668%"}}><Text></Text></View>
          <View style={{...styles.cell, width: "16.666666666666668%"}}><Text></Text></View>
        </View>
      </View>
      <Text style={styles.p}>Provide information on project(s) for which ongoing Rehabilitation and Resettlement (R&amp;R) is being undertaken by your entity, in the following format:</Text>
      <View style={styles.table}>
        <View style={styles.row}>
          <View style={{...styles.cell, width: "14.285714285714286%"}}><Text>S.</Text></View>
          <View style={{...styles.cell, width: "14.285714285714286%"}}><Text>Name of Project</Text></View>
          <View style={{...styles.cell, width: "14.285714285714286%"}}><Text></Text></View>
          <View style={{...styles.cell, width: "14.285714285714286%"}}><Text></Text></View>
          <View style={{...styles.cell, width: "14.285714285714286%"}}><Text></Text></View>
          <View style={{...styles.cell, width: "14.285714285714286%"}}><Text></Text></View>
          <View style={{...styles.cell, width: "14.285714285714286%"}}><Text></Text></View>
        </View>
        <View style={styles.row}>
          <View style={{...styles.cell, width: "14.285714285714286%"}}><Text>No.</Text></View>
          <View style={{...styles.cell, width: "14.285714285714286%"}}><Text>for which R&amp;R is</Text></View>
          <View style={{...styles.cell, width: "14.285714285714286%"}}><Text></Text></View>
          <View style={{...styles.cell, width: "14.285714285714286%"}}><Text></Text></View>
          <View style={{...styles.cell, width: "14.285714285714286%"}}><Text></Text></View>
          <View style={{...styles.cell, width: "14.285714285714286%"}}><Text></Text></View>
          <View style={{...styles.cell, width: "14.285714285714286%"}}><Text></Text></View>
        </View>
        <View style={styles.row}>
          <View style={{...styles.cell, width: "14.285714285714286%"}}><Text></Text></View>
          <View style={{...styles.cell, width: "14.285714285714286%"}}><Text>ongoing</Text></View>
          <View style={{...styles.cell, width: "14.285714285714286%"}}><Text></Text></View>
          <View style={{...styles.cell, width: "14.285714285714286%"}}><Text></Text></View>
          <View style={{...styles.cell, width: "14.285714285714286%"}}><Text></Text></View>
          <View style={{...styles.cell, width: "14.285714285714286%"}}><Text></Text></View>
          <View style={{...styles.cell, width: "14.285714285714286%"}}><Text></Text></View>
        </View>
        <View style={styles.row}>
          <View style={{...styles.cell, width: "14.285714285714286%"}}><Text></Text></View>
          <View style={{...styles.cell, width: "14.285714285714286%"}}><Text></Text></View>
          <View style={{...styles.cell, width: "14.285714285714286%"}}><Text></Text></View>
          <View style={{...styles.cell, width: "14.285714285714286%"}}><Text></Text></View>
          <View style={{...styles.cell, width: "14.285714285714286%"}}><Text></Text></View>
          <View style={{...styles.cell, width: "14.285714285714286%"}}><Text></Text></View>
          <View style={{...styles.cell, width: "14.285714285714286%"}}><Text></Text></View>
        </View>
      </View>
      <Text style={styles.p}>Describe the mechanisms to receive and redress grievances of the community.</Text>
      <Text style={styles.p}>Percentage of input material (inputs to total inputs by value) sourced from suppliers:</Text>
      <View style={styles.table}>
        <View style={styles.row}>
          <View style={{...styles.cell, width: "33.333333333333336%"}}><Text></Text></View>
          <View style={{...styles.cell, width: "33.333333333333336%"}}><Text>FY (2024-25)  Current Financial Year</Text></View>
          <View style={{...styles.cell, width: "33.333333333333336%"}}><Text></Text></View>
        </View>
        <View style={styles.row}>
          <View style={{...styles.cell, width: "33.333333333333336%"}}><Text>Directly	sourced	from	MSMEs/	small  producers</Text></View>
          <View style={{...styles.cell, width: "33.333333333333336%"}}><Text>4.56%</Text></View>
          <View style={{...styles.cell, width: "33.333333333333336%"}}><Text></Text></View>
        </View>
        <View style={styles.row}>
          <View style={{...styles.cell, width: "33.333333333333336%"}}><Text>Directly from within India</Text></View>
          <View style={{...styles.cell, width: "33.333333333333336%"}}><Text>70.55%</Text></View>
          <View style={{...styles.cell, width: "33.333333333333336%"}}><Text></Text></View>
        </View>
      </View>
      <Text style={styles.p}>Job creation in smaller towns – Disclose wages paid to persons employed (including employees or workers employed on a permanent or non-permanent / on contract basis) in the following locations, as % of total wage cost</Text>
      <View style={styles.table}>
        <View style={styles.row}>
          <View style={{...styles.cell, width: "33.333333333333336%"}}><Text>Location</Text></View>
          <View style={{...styles.cell, width: "33.333333333333336%"}}><Text>FY (2024-25)  Current Financial Year</Text></View>
          <View style={{...styles.cell, width: "33.333333333333336%"}}><Text></Text></View>
        </View>
        <View style={styles.row}>
          <View style={{...styles.cell, width: "33.333333333333336%"}}><Text>Rural</Text></View>
          <View style={{...styles.cell, width: "33.333333333333336%"}}><Text></Text></View>
          <View style={{...styles.cell, width: "33.333333333333336%"}}><Text></Text></View>
        </View>
        <View style={styles.row}>
          <View style={{...styles.cell, width: "33.333333333333336%"}}><Text>Semi-urban</Text></View>
          <View style={{...styles.cell, width: "33.333333333333336%"}}><Text></Text></View>
          <View style={{...styles.cell, width: "33.333333333333336%"}}><Text></Text></View>
        </View>
        <View style={styles.row}>
          <View style={{...styles.cell, width: "33.333333333333336%"}}><Text>Urban</Text></View>
          <View style={{...styles.cell, width: "33.333333333333336%"}}><Text>0.00%</Text></View>
          <View style={{...styles.cell, width: "33.333333333333336%"}}><Text></Text></View>
        </View>
        <View style={styles.row}>
          <View style={{...styles.cell, width: "33.333333333333336%"}}><Text>Metropolitan</Text></View>
          <View style={{...styles.cell, width: "33.333333333333336%"}}><Text></Text></View>
          <View style={{...styles.cell, width: "33.333333333333336%"}}><Text></Text></View>
        </View>
      </View>
      <Text style={styles.p}>(Place to be categorized as per RBI Classification System - rural / semi-urban / urban / metropolitan)</Text>
      <Text style={styles.p}>Leadership Indicators</Text>
      <Text style={styles.p}>Provide details of actions taken to mitigate any negative social impacts identified in the Social Impact Assessments (Reference: Question 1 of Essential Indicators above):</Text>
      <View style={styles.table}>
        <View style={styles.row}>
          <View style={{...styles.cell, width: "50.0%"}}><Text>Details of negative social impact identified</Text></View>
          <View style={{...styles.cell, width: "50.0%"}}><Text>Corrective action taken</Text></View>
        </View>
        <View style={styles.row}>
          <View style={{...styles.cell, width: "50.0%"}}><Text>NA</Text></View>
          <View style={{...styles.cell, width: "50.0%"}}><Text>NA</Text></View>
        </View>
      </View>
      <Text style={styles.p}>Provide the following information on CSR projects undertaken by your entity in designated aspirational districts as identified by government bodies</Text>
      <View style={styles.table}>
        <View style={styles.row}>
          <View style={{...styles.cell, width: "25.0%"}}><Text>S. No.</Text></View>
          <View style={{...styles.cell, width: "25.0%"}}><Text>State</Text></View>
          <View style={{...styles.cell, width: "25.0%"}}><Text></Text></View>
          <View style={{...styles.cell, width: "25.0%"}}><Text></Text></View>
        </View>
        <View style={styles.row}>
          <View style={{...styles.cell, width: "25.0%"}}><Text></Text></View>
          <View style={{...styles.cell, width: "25.0%"}}><Text></Text></View>
          <View style={{...styles.cell, width: "25.0%"}}><Text></Text></View>
          <View style={{...styles.cell, width: "25.0%"}}><Text></Text></View>
        </View>
        <View style={styles.row}>
          <View style={{...styles.cell, width: "25.0%"}}><Text></Text></View>
          <View style={{...styles.cell, width: "25.0%"}}><Text></Text></View>
          <View style={{...styles.cell, width: "25.0%"}}><Text></Text></View>
          <View style={{...styles.cell, width: "25.0%"}}><Text></Text></View>
        </View>
      </View>
      <Text style={styles.p}>(a) Do you have a preferential procurement policy where you give preference to purchase from suppliers comprising marginalized /vulnerable groups? (Yes/No)</Text>
      <Text style={styles.p}>(b) From which marginalized /vulnerable groups do you procure?</Text>
      <Text style={styles.p}>NA</Text>
      <Text style={styles.p}>(c) What percentage of total procurement (by value) does it constitute?</Text>
      <Text style={styles.p}>NA</Text>
      <Text style={styles.p}>Details of the benefits derived and shared from the intellectual properties owned or acquired by your entity (in the current financial year), based on traditional knowledge</Text>
      <View style={styles.table}>
        <View style={styles.row}>
          <View style={{...styles.cell, width: "20.0%"}}><Text>S. No.</Text></View>
          <View style={{...styles.cell, width: "20.0%"}}><Text>Intellectual Property based on traditional knowledge</Text></View>
          <View style={{...styles.cell, width: "20.0%"}}><Text></Text></View>
          <View style={{...styles.cell, width: "20.0%"}}><Text></Text></View>
          <View style={{...styles.cell, width: "20.0%"}}><Text></Text></View>
        </View>
        <View style={styles.row}>
          <View style={{...styles.cell, width: "20.0%"}}><Text></Text></View>
          <View style={{...styles.cell, width: "20.0%"}}><Text></Text></View>
          <View style={{...styles.cell, width: "20.0%"}}><Text></Text></View>
          <View style={{...styles.cell, width: "20.0%"}}><Text></Text></View>
          <View style={{...styles.cell, width: "20.0%"}}><Text></Text></View>
        </View>
        <View style={styles.row}>
          <View style={{...styles.cell, width: "20.0%"}}><Text></Text></View>
          <View style={{...styles.cell, width: "20.0%"}}><Text></Text></View>
          <View style={{...styles.cell, width: "20.0%"}}><Text></Text></View>
          <View style={{...styles.cell, width: "20.0%"}}><Text></Text></View>
          <View style={{...styles.cell, width: "20.0%"}}><Text></Text></View>
        </View>
      </View>
      <Text style={styles.p}>Details of corrective actions taken or underway, based on any adverse order in intellectual property related disputes wherein usage of traditional knowledge is involved.</Text>
      <View style={styles.table}>
        <View style={styles.row}>
          <View style={{...styles.cell, width: "33.333333333333336%"}}><Text>Name of authority</Text></View>
          <View style={{...styles.cell, width: "33.333333333333336%"}}><Text>Brief of the Case</Text></View>
          <View style={{...styles.cell, width: "33.333333333333336%"}}><Text></Text></View>
        </View>
        <View style={styles.row}>
          <View style={{...styles.cell, width: "33.333333333333336%"}}><Text></Text></View>
          <View style={{...styles.cell, width: "33.333333333333336%"}}><Text></Text></View>
          <View style={{...styles.cell, width: "33.333333333333336%"}}><Text></Text></View>
        </View>
      </View>
      <Text style={styles.p}>Details of beneficiaries of CSR Projects:</Text>
      <View style={styles.table}>
        <View style={styles.row}>
          <View style={{...styles.cell, width: "25.0%"}}><Text>S. No.</Text></View>
          <View style={{...styles.cell, width: "25.0%"}}><Text>CSR Project</Text></View>
          <View style={{...styles.cell, width: "25.0%"}}><Text></Text></View>
          <View style={{...styles.cell, width: "25.0%"}}><Text></Text></View>
        </View>
        <View style={styles.row}>
          <View style={{...styles.cell, width: "25.0%"}}><Text>1</Text></View>
          <View style={{...styles.cell, width: "25.0%"}}><Text>Education and Welfare of deaf Children and for Trainees</Text></View>
          <View style={{...styles.cell, width: "25.0%"}}><Text></Text></View>
          <View style={{...styles.cell, width: "25.0%"}}><Text></Text></View>
        </View>
        <View style={styles.row}>
          <View style={{...styles.cell, width: "25.0%"}}><Text>2</Text></View>
          <View style={{...styles.cell, width: "25.0%"}}><Text>Heart Surgery free of cost for needy people</Text></View>
          <View style={{...styles.cell, width: "25.0%"}}><Text></Text></View>
          <View style={{...styles.cell, width: "25.0%"}}><Text></Text></View>
        </View>
        <View style={styles.row}>
          <View style={{...styles.cell, width: "25.0%"}}><Text>3</Text></View>
          <View style={{...styles.cell, width: "25.0%"}}><Text>Anandham – Welfare of Mentally Challenged People*</Text></View>
          <View style={{...styles.cell, width: "25.0%"}}><Text></Text></View>
          <View style={{...styles.cell, width: "25.0%"}}><Text></Text></View>
        </View>
      </View>
      <Text style={styles.p}>Essential Indicators</Text>
      <Text style={styles.p}>Describe the mechanisms in place to receive and respond to consumer complaints and feedback:</Text>
      <Text style={styles.p}>Turnover of products and/ services as a percentage of turnover from all products/service that carry information about:</Text>
      <View style={styles.table}>
        <View style={styles.row}>
          <View style={{...styles.cell, width: "50.0%"}}><Text></Text></View>
          <View style={{...styles.cell, width: "50.0%"}}><Text>As a percentage to total turnover</Text></View>
        </View>
        <View style={styles.row}>
          <View style={{...styles.cell, width: "50.0%"}}><Text>Environmental and social parameters relevant to the product</Text></View>
          <View style={{...styles.cell, width: "50.0%"}}><Text></Text></View>
        </View>
        <View style={styles.row}>
          <View style={{...styles.cell, width: "50.0%"}}><Text>Safe and responsible usage</Text></View>
          <View style={{...styles.cell, width: "50.0%"}}><Text></Text></View>
        </View>
        <View style={styles.row}>
          <View style={{...styles.cell, width: "50.0%"}}><Text>Recycling and/or safe disposal</Text></View>
          <View style={{...styles.cell, width: "50.0%"}}><Text></Text></View>
        </View>
      </View>
      <Text style={styles.p}>Number of consumer complaints in respect of the following:</Text>
      <View style={styles.table}>
        <View style={styles.row}>
          <View style={{...styles.cell, width: "14.285714285714286%"}}><Text></Text></View>
          <View style={{...styles.cell, width: "14.285714285714286%"}}><Text></Text></View>
          <View style={{...styles.cell, width: "14.285714285714286%"}}><Text></Text></View>
          <View style={{...styles.cell, width: "14.285714285714286%"}}><Text></Text></View>
          <View style={{...styles.cell, width: "14.285714285714286%"}}><Text></Text></View>
          <View style={{...styles.cell, width: "14.285714285714286%"}}><Text></Text></View>
          <View style={{...styles.cell, width: "14.285714285714286%"}}><Text></Text></View>
        </View>
        <View style={styles.row}>
          <View style={{...styles.cell, width: "14.285714285714286%"}}><Text></Text></View>
          <View style={{...styles.cell, width: "14.285714285714286%"}}><Text>Received during the year</Text></View>
          <View style={{...styles.cell, width: "14.285714285714286%"}}><Text></Text></View>
          <View style={{...styles.cell, width: "14.285714285714286%"}}><Text></Text></View>
          <View style={{...styles.cell, width: "14.285714285714286%"}}><Text></Text></View>
          <View style={{...styles.cell, width: "14.285714285714286%"}}><Text></Text></View>
          <View style={{...styles.cell, width: "14.285714285714286%"}}><Text></Text></View>
        </View>
        <View style={styles.row}>
          <View style={{...styles.cell, width: "14.285714285714286%"}}><Text>Data privacy</Text></View>
          <View style={{...styles.cell, width: "14.285714285714286%"}}><Text></Text></View>
          <View style={{...styles.cell, width: "14.285714285714286%"}}><Text></Text></View>
          <View style={{...styles.cell, width: "14.285714285714286%"}}><Text></Text></View>
          <View style={{...styles.cell, width: "14.285714285714286%"}}><Text></Text></View>
          <View style={{...styles.cell, width: "14.285714285714286%"}}><Text></Text></View>
          <View style={{...styles.cell, width: "14.285714285714286%"}}><Text></Text></View>
        </View>
        <View style={styles.row}>
          <View style={{...styles.cell, width: "14.285714285714286%"}}><Text>Advertising</Text></View>
          <View style={{...styles.cell, width: "14.285714285714286%"}}><Text></Text></View>
          <View style={{...styles.cell, width: "14.285714285714286%"}}><Text></Text></View>
          <View style={{...styles.cell, width: "14.285714285714286%"}}><Text></Text></View>
          <View style={{...styles.cell, width: "14.285714285714286%"}}><Text></Text></View>
          <View style={{...styles.cell, width: "14.285714285714286%"}}><Text></Text></View>
          <View style={{...styles.cell, width: "14.285714285714286%"}}><Text></Text></View>
        </View>
        <View style={styles.row}>
          <View style={{...styles.cell, width: "14.285714285714286%"}}><Text>Cyber-security</Text></View>
          <View style={{...styles.cell, width: "14.285714285714286%"}}><Text></Text></View>
          <View style={{...styles.cell, width: "14.285714285714286%"}}><Text></Text></View>
          <View style={{...styles.cell, width: "14.285714285714286%"}}><Text></Text></View>
          <View style={{...styles.cell, width: "14.285714285714286%"}}><Text></Text></View>
          <View style={{...styles.cell, width: "14.285714285714286%"}}><Text></Text></View>
          <View style={{...styles.cell, width: "14.285714285714286%"}}><Text></Text></View>
        </View>
        <View style={styles.row}>
          <View style={{...styles.cell, width: "14.285714285714286%"}}><Text>Delivery of essential  services</Text></View>
          <View style={{...styles.cell, width: "14.285714285714286%"}}><Text></Text></View>
          <View style={{...styles.cell, width: "14.285714285714286%"}}><Text></Text></View>
          <View style={{...styles.cell, width: "14.285714285714286%"}}><Text></Text></View>
          <View style={{...styles.cell, width: "14.285714285714286%"}}><Text></Text></View>
          <View style={{...styles.cell, width: "14.285714285714286%"}}><Text></Text></View>
          <View style={{...styles.cell, width: "14.285714285714286%"}}><Text></Text></View>
        </View>
        <View style={styles.row}>
          <View style={{...styles.cell, width: "14.285714285714286%"}}><Text>Restrictive Trade Practices</Text></View>
          <View style={{...styles.cell, width: "14.285714285714286%"}}><Text></Text></View>
          <View style={{...styles.cell, width: "14.285714285714286%"}}><Text></Text></View>
          <View style={{...styles.cell, width: "14.285714285714286%"}}><Text></Text></View>
          <View style={{...styles.cell, width: "14.285714285714286%"}}><Text></Text></View>
          <View style={{...styles.cell, width: "14.285714285714286%"}}><Text></Text></View>
          <View style={{...styles.cell, width: "14.285714285714286%"}}><Text></Text></View>
        </View>
        <View style={styles.row}>
          <View style={{...styles.cell, width: "14.285714285714286%"}}><Text>Unfair Trade Practices</Text></View>
          <View style={{...styles.cell, width: "14.285714285714286%"}}><Text></Text></View>
          <View style={{...styles.cell, width: "14.285714285714286%"}}><Text></Text></View>
          <View style={{...styles.cell, width: "14.285714285714286%"}}><Text></Text></View>
          <View style={{...styles.cell, width: "14.285714285714286%"}}><Text></Text></View>
          <View style={{...styles.cell, width: "14.285714285714286%"}}><Text></Text></View>
          <View style={{...styles.cell, width: "14.285714285714286%"}}><Text></Text></View>
        </View>
        <View style={styles.row}>
          <View style={{...styles.cell, width: "14.285714285714286%"}}><Text>Other</Text></View>
          <View style={{...styles.cell, width: "14.285714285714286%"}}><Text></Text></View>
          <View style={{...styles.cell, width: "14.285714285714286%"}}><Text></Text></View>
          <View style={{...styles.cell, width: "14.285714285714286%"}}><Text></Text></View>
          <View style={{...styles.cell, width: "14.285714285714286%"}}><Text></Text></View>
          <View style={{...styles.cell, width: "14.285714285714286%"}}><Text></Text></View>
          <View style={{...styles.cell, width: "14.285714285714286%"}}><Text></Text></View>
        </View>
      </View>
      <Text style={styles.p}>Details of instances of product recalls on account of safety issues:</Text>
      <View style={styles.table}>
        <View style={styles.row}>
          <View style={{...styles.cell, width: "33.333333333333336%"}}><Text></Text></View>
          <View style={{...styles.cell, width: "33.333333333333336%"}}><Text>Number</Text></View>
          <View style={{...styles.cell, width: "33.333333333333336%"}}><Text></Text></View>
        </View>
        <View style={styles.row}>
          <View style={{...styles.cell, width: "33.333333333333336%"}}><Text>Voluntary recalls</Text></View>
          <View style={{...styles.cell, width: "33.333333333333336%"}}><Text></Text></View>
          <View style={{...styles.cell, width: "33.333333333333336%"}}><Text></Text></View>
        </View>
        <View style={styles.row}>
          <View style={{...styles.cell, width: "33.333333333333336%"}}><Text>Forced recalls</Text></View>
          <View style={{...styles.cell, width: "33.333333333333336%"}}><Text></Text></View>
          <View style={{...styles.cell, width: "33.333333333333336%"}}><Text></Text></View>
        </View>
      </View>
      <Text style={styles.p}>Does the entity have a framework/ policy on cyber security and risks related to data privacy? (Yes/No) If available, provide a web-link of the policy.</Text>
      <Text style={styles.p}>- Yes, the entity has a policy on cyber security and risks related to data privacy. The policy is available on the intranet.</Text>
      <Text style={styles.p}>- Tata Consumer Products Limited LTD have TISAX label.</Text>
      <Text style={styles.p}>Provide details of any corrective actions taken or underway on issues relating to advertising, and delivery of essential services; cyber security and data privacy of customers; re-occurrence of instances of product recalls; penalty / action taken by regulatory authorities on safety of products / services.</Text>
      <Text style={styles.p}>Provide the following information relating to data breaches:</Text>
      <Text style={styles.p}>Number of instances of data breaches - 0</Text>
      <Text style={styles.p}>Percentage of data breaches involving personally identifiable information of customers – 0.00%</Text>
      <Text style={styles.p}>Impact, if any, of the data breaches – 0</Text>
      <Text style={styles.p}>Leadership Indicators</Text>
      <Text style={styles.p}>Channels / platforms where information on products and services of the entity can be accessed (provide web link, if available).</Text>
      <Text style={styles.p}>Product information available on company&apos;s website https://www.harshaengineers.com/</Text>
      <Text style={styles.p}>Steps taken to inform and educate consumers about safe and responsible usage of products and/or services.</Text>
      <Text style={styles.p}>TCPL is not product design owner</Text>
      <Text style={styles.p}>Mechanisms in place to inform consumers of any risk of disruption/discontinuation of essential services.</Text>
      <Text style={styles.p}>NA</Text>
      <Text style={styles.p}>Does the entity display product information on the product over and above what is mandated as per local laws? (Yes/No/Not Applicable) If yes, provide details in brief. Did your entity carry out any survey with regard to consumer satisfaction relating to the major products / services of the entity, significant locations of operation of the entity or the entity as a whole? (Yes/No)</Text>
      <Text style={styles.p}>TCPL manufactures product according to print design provided by our customer. This is not applicable to us. We carry out survey of our major products with our customer who are the Bearing manufacturers.</Text>
    </Page>
  </Document>
);
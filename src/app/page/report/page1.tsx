'use client'
import { CalculatedField, FieldList, IDataOptions, IDataSet, Inject, PivotViewComponent } from '@syncfusion/ej2-react-pivotview';
import { tableData } from '../data/data'; // Assuming tableData is exported from this file

export default function Home() {
  // Transform the tableData into the format Syncfusion expects
  const dataSourceSettings: IDataOptions = {
    columns: [{ name: 'fundSource', caption: 'Fund Source' }, { name: 'category', caption: 'Category' }],
    dataSource: tableData as IDataSet[], // Casting tableData to the expected data structure
    expandAll: false,
    filters: [],
    drilledMembers: [{ name: 'fundSource', items: ['General Fund'] }], // Default drilled member example
    formatSettings: [{ name: 'amount', format: 'C0' }], // Formatting the amount column
    rows: [{ name: 'head', caption: 'Head Office' }, { name: 'paidTo', caption: 'Paid To' }],
    values: [{ name: 'amount', caption: 'Amount' }]
  };

  return (
    <>
      <h2>Syncfusion React Pivot Table Component</h2>
      <PivotViewComponent id='PivotView' height={350} dataSourceSettings={dataSourceSettings} allowCalculatedField={true} showFieldList={true}>
        <Inject services={[CalculatedField, FieldList]} />
      </PivotViewComponent>
    </>
  );
}

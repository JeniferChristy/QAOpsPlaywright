const ExcelJs = require('exceljs');
const {test, expect} = require('@playwright/test');

async function writeExcelTest(searchText,replaceText,change,filePath)
{

const workbook= new ExcelJs.Workbook();
await workbook.xlsx.readFile(filePath);
const worksheet= workbook.getWorksheet('Sheet1');
const output= readExcel(worksheet, searchText);

if (output.row === -1) {
    throw new Error(`"${searchText}" not found in Sheet1 - nothing to update`);
}

const cell = worksheet.getCell(output.row+change.rowChange, output.column+change.colChange);
cell.value = replaceText;
await workbook.xlsx.writeFile(filePath);                       //update

}

function readExcel(worksheet, searchText)
{
    let output = {row:-1, column:-1};
    worksheet.eachRow( (row, rowNumber) =>
{
    row.eachCell((cell, colNumber)=>
    {
       // console.log(cell.value);
       if(output.row === -1 && cell.value === searchText)
        {
            output.row= rowNumber;
            output.column=colNumber;
       }
    })


})
return output;
}

test('Upload download excel validation',async ({page})=>
{
    const textSearch = 'Mango';
    const updateValue = 350;
    const filePath = "C:/Users/Admin/Downloads/download.xlsx";

    await page.goto("https://rahulshettyacademy.com/upload-download-test/index.html");
    const downloadPromise= page.waitForEvent('download');
    await page.getByRole('button',{name:'Download'}).click();
    const download = await downloadPromise;
    await download.saveAs(filePath);

    await writeExcelTest(textSearch,updateValue, {rowChange:0,colChange:2}, filePath);
    await page.locator("#fileinput").setInputFiles(filePath);

    const desiredRow = page.getByRole('row').filter({has:page.getByText(textSearch)});
    await expect(desiredRow.getByRole('cell').nth(3)).toHaveText(String(updateValue));   // Price column
})

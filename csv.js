function parseProductsCsv(text) {
  const records = [];
  let record = [];
  let field = '';
  let quoted = false;
  let afterQuote = false;
  const input = text.replace(/^\uFEFF/, '');

  for (let index = 0; index < input.length; index++) {
    const char = input[index];
    if (quoted) {
      if (char === '"' && input[index + 1] === '"') {
        field += '"';
        index++;
      } else if (char === '"') {
        quoted = false;
        afterQuote = true;
      } else {
        field += char;
      }
    } else if (char === ',') {
      record.push(field);
      field = '';
      afterQuote = false;
    } else if (char === '\r' || char === '\n') {
      if (char === '\r' && input[index + 1] === '\n') index++;
      record.push(field);
      if (record.some(value => value !== '')) records.push(record);
      record = [];
      field = '';
      afterQuote = false;
    } else if (char === '"' && field === '' && !afterQuote) {
      quoted = true;
    } else if (afterQuote || char === '"') {
      throw new Error('CSV 引号格式错误');
    } else {
      field += char;
    }
  }

  if (quoted) throw new Error('CSV 引号未闭合');
  if (record.length || field !== '' || afterQuote) {
    record.push(field);
    records.push(record);
  }

  const [headers, ...rows] = records;
  const required = ['row', 'product_name', 'price', 'shop', 'commission', 'link', 'image_token', 'sheet_name'];
  if (!headers || required.some(name => !headers.includes(name)) || new Set(headers).size !== headers.length) {
    throw new Error('CSV 缺少必需列或列名重复');
  }
  return rows.map((values, index) => {
    if (values.length !== headers.length) throw new Error(`CSV 第 ${index + 2} 行列数不正确`);
    return Object.fromEntries(headers.map((name, column) => [name, values[column]]));
  });
}

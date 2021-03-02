const stringify = (list) => {
  // 这个函数用来把数组扁平化为字符串, 格式见示例
  // 输入的数组只包含数组和数字两种类型复合
  let res = '[ ';
  for (let i= 0; i < list.length; i++) {
    const e = list[i]
    if (typeof e !== 'number') {
      res += stringify(e) + ' '
    } else {
      res += `${e} `
    }
  }
  res += ']'
  return res;
}

// 以下是单元测试

const test = () => {
  const listArray = [
      {
          input: [1, 2, [3, 4, 5]],
          output: '[ 1 2 [ 3 4 5 ] ]',
      },
      {
          input: [79, [[88, 98], 99]],
          output: '[ 79 [ [ 88 98 ] 99 ] ]',
      },
  ]
  listArray.map(data => {
      const result = stringify(data.input)
      console.log(result)
      console.log(result === data.output)
  })
}

test();
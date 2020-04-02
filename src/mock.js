/**
 * Created by wentan on 2019/1/15.
 */
//引入mockjs
const Mock = require('mockjs')
//使用mockjs模拟数据
const Random=Mock.Random    //mock.random是一个工具类
let data=[];
let arr=[];
for(let i=0;i<10;i++){
 let template={
  'Boolean':Random.boolean,    //生成基本数据类型
   'Natural':Random.natural(1,100),
   'integer':Random.integer(1,100),
   'Float':Random.float(0,100,0,5),        //生成1-100浮点数到小数点后五位
   'Character':Random.character(),         //生成随机字符串
   'String':Random.string(2,10),           //生成2-10个字符串之间的字符串
   'Range':Random.range(0,10,2),
   'Paragraph':Random.paragraph(2,5),      //生成2-5个句子的文本
   'Url':Random.url()
 }
  data.push(template)
}
Mock.mock('/api/data','post',data)         //根据模板生成模拟数据

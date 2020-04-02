<template>
  <div>
   <div id='map'>
  


  </div>


  </div>
</template>
<style>
  .hongbao_zanzhu{
    display: block;
    position:fixed;
    text-align: center;
    bottom: 336px;
    width:230px;
    right: 0;
    font-size: 23px;
    color: #505458;
  }
  .hongbao{
    position:fixed;
    bottom: 0;
    right: 0;
    height:330px;
    width:230px;
  }
</style>
<script>
import '../apis/map.bundle.js'

    export default {
        name: 'map2',
        data() {
          return{

          }
 
        },
        mounted(){
             this.showMap()
        },
        methods:{
           showMap(){
               const mapUrl =
                'http://t0.tianditu.gov.cn/img_w/wmts?SERVICE=WMTS&REQUEST=GetTile&VERSION=1.0.0&LAYER=img&STYLE=default&TILEMATRIXSET=w&FORMAT=tiles&&TILEMATRIX={z}&TILEROW={y}&TILECOL={x}&tk=612ea066c4645a3b24fc5a5df41062a8'
              //createMap(<map div name>, <center>, <zoom level>, <map url>)
              const annourl = 'http://t3.tianditu.gov.cn/DataServer?T=cva_w&tk=612ea066c4645a3b24fc5a5df41062a8&x={x}&y={y}&l={z}'
              createMap("map", [104, 30], 10, mapUrl, annourl)
           }


        }
    }

</script>

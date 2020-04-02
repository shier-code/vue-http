<template>
  
  <div id='map'>
  </div>


  
</template>
<style>

</style>
<script>
 import '../../apis/map.bundle.js'

    export default {
        name: 'map1',
        data() {
          return{}

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
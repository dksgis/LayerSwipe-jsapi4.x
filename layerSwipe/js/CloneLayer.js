define([
  "esri/layers/Layer",
  "esri/layers/TileLayer",
  "esri/layers/MapImageLayer",
  "esri/layers/FeatureLayer",
  "esri/layers/GraphicsLayer",
  "esri/layers/SceneLayer",
  "esri/layers/VectorTileLayer",
  "esri/layers/ImageryLayer",
  "esri/layers/ElevationLayer",
], function(Layer,TileLayer,MapImageLayer,FeatureLayer,
  GraphicsLayer,SceneLayer,VectorTileLayer,ImageryLayer,
  ElevationLayer) {
  var Widget = function() {
    this._init();
  };
  Widget.prototype = {
    _init: function() {
    },
    cloneOptions : function(options) {
      var ret = {};
      for (var i in options) {
          var item = options[i];
          if (item && item.clone) {
              ret[i] = item.clone();
          } else if (item instanceof Layer) {
              ret[i] = cloneLayer(item);
          } else {
              ret[i] = item;
          }
      }
      return ret;
    },
    cloneInnerLayers:function  (layer) {
        var layers = [];
        layer.eachLayer(function (inner) {
            layers.push(cloneLayer(inner));
        });
        return layers;
    },
    cloneLayer:function (layer) {
        var options = this.cloneOptions(layer);
        if(layer instanceof TileLayer){
          var _layer = new TileLayer({
            id:options.id,
            title:options.title,
            url:options.url
          });
          // var _layer = new TileLayer({
          //   id:options.id,
          //   fullExtent:options.fullExtent,
          //   legendEnabled:options.legendEnabled,
          //   maxScale:options.maxScale,
          //   minScale:options.minScale,
          //   opacity:options.opacity,
          //   // portalItem:options.portalItem,
          //   refreshInterval:options.refreshInterval,
          //   spatialReference:options.spatialReference,
          //   tileInfo:options.tileInfo,
          //   // tileServers:options.tileServers,
          //   title:options.title,
          //   url:options.url,
          //   visible:options.visible
          // });
          return _layer;
        }
        if(layer instanceof MapImageLayer){
          var _layer = new MapImageLayer({
            id:options.id,
            spatialReference:options.spatialReference,
            sublayers:options.sublayers,
            title:options.title,
            url:options.url
          });
          // var _layer = new MapImageLayer({
          //   id:options.id,
          //   copyright:options.copyright,
          //   dpi:options.dpi,
          //   gdbVersion:options.gdbVersion,
          //   imageFormat:options.imageFormat,
          //   imageMaxHeight:options.imageMaxHeight,
          //   imageMaxWidth:options.imageMaxWidth,
          //   imageTransparency:options.imageTransparency,
          //   legendEnabled:options.legendEnabled,
          //   listMode:options.listMode,
          //   maxScale:options.maxScale,
          //   minScale:options.minScale,
          //   opacity:options.opacity,
          //   portalItem:options.portalItem,
          //   refreshInterval:options.refreshInterval,
          //   spatialReference:options.spatialReference,
          //   sublayers:options.sublayers,
          //   title:options.title,
          //   url:options.url,
          //   visible:options.visible
          // });
          return _layer;
        }
        if(layer instanceof FeatureLayer){
          var _layer = new FeatureLayer({
            definitionExpression:options.definitionExpression,
            url:options.url,
            spatialReference:options.spatialReference,
            popupTemplate:options.popupTemplate,
            id:options.id,
            title:options.title
          });
          // var _layer = new FeatureLayer({
          //   id:options.id,
          //   copyright:options.copyright,
          //   definitionExpression:options.definitionExpression,
          //   displayField:options.displayField,
          //   dynamicDataSource:options.dynamicDataSource,
          //   elevationInfo:options.elevationInfo,
          //   featureReduction:options.featureReduction,
          //   fields:options.fields,
          //   fullExtent:options.fullExtent,
          //   geometryType:options.geometryType,
          //   historicMoment:options.historicMoment,
          //   labelingInfo:options.labelingInfo,
          //   labelsVisible:options.labelsVisible,
          //   layerId:options.layerId,
          //   legendEnabled:options.legendEnabled,
          //   listMode:options.listMode,
          //   maxScale:options.maxScale,
          //   minScale:options.minScale,
          //   opacity:options.opacity,
          //   objectIdField:options.objectIdField,
          //   outFields:options.outFields,
          //   popupEnabled:options.popupEnabled,
          //   popupTemplate:options.popupTemplate,
          //   portalItem:options.portalItem,
          //   refreshInterval:options.refreshInterval,
          //   renderer:options.renderer,
          //   returnM:options.returnM,
          //   returnZ:options.returnZ,
          //   screenSizePerspectiveEnabled:options.screenSizePerspectiveEnabled,
          //   source:options.source,
          //   templates:options.templates,
          //   spatialReference:options.spatialReference,
          //   title:options.title,
          //   types:options.types,
          //   url:options.url,
          //   visible:options.visible
          // });
          return _layer;
        }
        if(layer instanceof GraphicsLayer){
          var _layer = new GraphicsLayer({
            id:options.id,
            elevationInfo:options.elevationInfo,
            fullExtent:options.fullExtent,
            graphics:options.graphics,
            listMode:options.listMode,
            screenSizePerspectiveEnabled:options.screenSizePerspectiveEnabled,
            maxScale:options.maxScale,
            minScale:options.minScale,
            opacity:options.opacity,
            spatialReference:options.spatialReference,
            title:options.title,
            visible:options.visible
          });
          return _layer;
        }
        if(layer instanceof SceneLayer){
          var _layer = new SceneLayer({
            id:options.id,
            definitionExpression:options.definitionExpression,
            popupEnabled:options.popupEnabled,
            popupTemplate:options.popupTemplate,
            spatialReference:options.spatialReference,
            title:options.title,
            visible:options.visible,
            url:options.url,
            renderer:options.renderer
          })
          // var _layer = new SceneLayer({
          //   id:options.id,
          //   copyright:options.copyright,
          //   definitionExpression:options.definitionExpression,
          //   elevationInfo:options.elevationInfo,
          //   featureReduction:options.featureReduction,
          //   fields:options.fields,
          //   fullExtent:options.fullExtent,
          //   geometryType:options.geometryType,
          //   labelingInfo:options.labelingInfo,
          //   labelsVisible:options.labelsVisible,
          //   layerId:options.layerId,
          //   legendEnabled:options.legendEnabled,
          //   listMode:options.listMode,
          //   objectIdField:options.objectIdField,
          //   opacity:options.opacity,
          //   popupEnabled:options.popupEnabled,
          //   popupTemplate:options.popupTemplate,
          //   portalItem:options.portalItem,
          //   renderer:options.renderer,
          //   screenSizePerspectiveEnabled:options.screenSizePerspectiveEnabled,
          //   spatialReference:options.spatialReference,
          //   title:options.title,
          //   visible:options.visible,
          //   url:options.url
          // });
          return _layer;
        }
        if(layer instanceof VectorTileLayer){
          var _layer = new VectorTileLayer({
            id:options.id,
            // fullExtent:options.fullExtent,
            // listMode:options.listMode,
            // maxScale:options.maxScale,
            // minScale:options.minScale,
            opacity:options.opacity,
            // portalItem:options.portalItem,
            // style:options.style,
            // tileInfo:options.tileInfo,
            spatialReference:options.spatialReference,
            title:options.title,
            // visible:options.visible,
            url:options.url
          });
          return _layer;
        }
        if(layer instanceof ImageryLayer){
          var _layer = new ImageryLayer({
            id:options.id,
            // compressionQuality:options.compressionQuality,
            // compressionTolerance:options.compressionTolerance,
            // copyright:options.copyright,
            // definitionExpression:options.definitionExpression,
            // domainFields:options.domainFields,
            // fields:options.fields,
            // format:options.format,
            // fullExtent:options.fullExtent,
            // hasMultidimensions:options.hasMultidimensions,
            // hasRasterAttributeTable:options.hasRasterAttributeTable,
            // imageMaxHeight:options.imageMaxHeight,
            // imageMaxWidth:options.imageMaxWidth,
            // listMode:options.listMode,
            // maxScale:options.maxScale,
            // minScale:options.minScale,
            // mosaicRule:options.mosaicRule,
            // multidimensionalInfo:options.multidimensionalInfo,
            // pixelFilter:options.pixelFilter,
            // pixelType:options.pixelType,
            // popupEnabled:options.popupEnabled,
            // popupTemplate:options.popupTemplate,
            // opacity:options.opacity,
            // portalItem:options.portalItem,
            // rasterAttributeTable:options.rasterAttributeTable,
            // rasterAttributeTableFieldPrefix:options.rasterAttributeTableFieldPrefix,
            // rasterFields:options.rasterFields,
            // refreshInterval:options.refreshInterval,
            // renderingRule:options.renderingRule,
            spatialReference:options.spatialReference,
            title:options.title,
            visible:options.visible,
            url:options.url
          });
          return _layer;
        }
      if(layer instanceof ElevationLayer){
        var _layer = new ElevationLayer({
          id:options.id,
          // copyright:options.copyright,
          // fullExtent:options.fullExtent,
          // listMode:options.listMode,
          opacity:options.opacity,
          // portalItem:options.portalItem,
          // tileInfo:options.tileInfo,
          spatialReference:options.spatialReference,
          title:options.title,
          visible:options.visible,
          url:options.url
        });
        return _layer;
      }
      throw 'Unknown layer, cannot clone this layer. Leaflet-version: ' + L.version;
    }
  }
  return Widget;
})

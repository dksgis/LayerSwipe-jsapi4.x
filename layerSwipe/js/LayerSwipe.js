define([
 "dojo/_base/declare", 
  'esri/views/MapView',
  'esri/views/SceneView',
  'esri/Map',
  'esri/core/watchUtils',
  'application/CloneLayer'
], function(declare,MapView,SceneView,Map,watchUtils,CloneLayer) {
return declare('application/LayerSwipe',null,{
	name:'LayerSwipe',
	view:null,
	type:null,
	layers:[],
	divId:null,
	constructor: function (options,divId) {
	  this._init(options,divId);
	},
	_init: function(options,divId) {
	  this.view=options.view
	  this.type=options.type
	  this.layers=options.layers
	  this.divId = divId;			
	},
	/**
	 * 启动
	 */		
	startup:function(){
	  var _self = this;
	  _self.destroy();
	  //创建卷帘地图
	  _self._createSwipeView();
	  //创建卷帘条
	  _self._cretaeSwipeLine();
	},
    /**
     * 创建对比地图
     */
    _createSwipeView: function(){
      var _self = this;
      var view = this.view;
      var viewDiv = "<div id ='swipeViewDiv' class='map swipeView'></div>";
      $('#'+this.divId).after(viewDiv); 
      var swipeMap = new Map();
      swipeMap.basemap = view.map.basemap;
      swipeMap.ground = view.map.ground;
      //存在A地图通过addMany方法添加B地图的layers，则B地图layers消失的问题
      // swipeMap.addMany(view.map.layers);
      // view.map.addMany(swipeMap.layers);
      var _layers = view.map.layers;
      for(var i=0,len=_layers.length;i<len;i++){
        var _layer = _layers.items[i];
        var _id = _layer.id;
        var isSwipeLayer =false;
        for(var j=0,jlen = this.layers.length;j<jlen;j++){
          var id = this.layers[j].id;
          if(id == _id){
            isSwipeLayer = true;
            break;
          }
        }
        var _CloneLayer = new CloneLayer();
        if(!isSwipeLayer)
        {
          var newlayer = _CloneLayer.cloneLayer(_layer);
          swipeMap.add(newlayer);
        }
      }
      /********以上代码保持两个地图一致*********/
      var swipeView = null;
	  if(view instanceof MapView){
		swipeView = new MapView({
			map: swipeMap,
			container: "swipeViewDiv",
			extent:view.extent
		});		  
	  }else{
		swipeView = new SceneView({
			map: swipeMap,
			container: "swipeViewDiv",
			environment: view.environment,
			camera:view.camera,
			extent:view.extent
		});		  
	  }
      this._synchronizeViews([view, swipeView]);
    },
    /**
     * 同步视图
     */
    _synchronizeView : function(view, others){
      //同步两个地图的方法——————————————————————————————————————————————————————————————————————————————————————————————————————————————————
      others = Array.isArray(others) ? others : [others];
      var viewpointWatchHandle;
      var viewStationaryHandle;
      var otherInteractHandlers;
      var scheduleId;
      var clear = function () {
        if (otherInteractHandlers) {
          otherInteractHandlers.forEach(function (handle) {
            handle.remove();
          });
        }
        viewpointWatchHandle && viewpointWatchHandle.remove();
        viewStationaryHandle && viewStationaryHandle.remove();
        scheduleId && clearTimeout(scheduleId);
        otherInteractHandlers = viewpointWatchHandle =
          viewStationaryHandle = scheduleId = null;
      };

      var interactWatcher = view.watch('interacting,animation',
        function (newValue) {
          if (!newValue) {
            return;
          }
          if (viewpointWatchHandle || scheduleId) {
            return;
          }
          // start updating the other views at the next frame
          scheduleId = setTimeout(function () {
            scheduleId = null;
            viewpointWatchHandle = view.watch('viewpoint',
              function (newValue) {
                others.forEach(function (otherView) {
                  otherView.viewpoint = newValue;
                });
              });
          }, 0);
          // stop as soon as another view starts interacting, like if the user starts panning
          otherInteractHandlers = others.map(function (otherView) {
            return watchUtils.watch(otherView,
              'interacting,animation',
              function (
                value) {
                if (value) {
                  clear();
                }
              });
          });
          // or stop when the view is stationary again
          viewStationaryHandle = watchUtils.whenTrue(view,
            'stationary', clear);
        });
      return {
        remove: function () {
          this.remove = function () { };
          clear();
          interactWatcher.remove();
        }
      }
    },
    _synchronizeViews : function (views) {
      var _self = this;
      var handles = views.map(function (view, idx, views) {
        var others = views.concat();
        others.splice(idx, 1);
        return _self._synchronizeView(view, others);
      });
      return {
        remove: function () {
          this.remove = function () { };
          handles.forEach(function (h) {
            h.remove();
          });
          handles = null;
        }
      }
    },
    /**
     * 创建滑动轴
     */
    _cretaeSwipeLine : function(){
      var $map = $('#'+this.divId);
	  $('#swipeViewDiv').css('height', $map.height() + 'px');
	  $('#swipeViewDiv').css('weight', $map.width() + 'px');	  
      var swipeLineTplHtml = "";
      if(this.type == "vertical"){
        swipeLineTplHtml = 
        '<div class="vertical-slider all-slider" style="height:'+ $map.height() + 'px;left:'+($map.width()/2)+'px;">'+
          '<div class="handle"></div>'+
        '</div>';
        $('#swipeViewDiv').css('clip', 'rect(0px ' + $map.width()+ 'px ' + $map.height() + 'px '+$map.width()/2+'px)');
      }else if(this.type == "horizontal"){
        swipeLineTplHtml = 
        '<div class="horizontal-slider all-slider" style="weight:'+ $map.width() + 'px;top:'+ ($map.height()/2)+'px;">'+
          '<div class="handle"></div>'+
        '</div>';
        $('#swipeViewDiv').css('clip', 'rect('+$map.height()/2+'px ' + $map.width() + 'px ' + $map.height() + 'px 0px)');
      }
      $('#'+this.divId).append(swipeLineTplHtml);
      this._bindEvent();
    },
    /**
     * 绑定事件
     */
    _bindEvent : function(){
      var _self = this;
      var $slider = $('.all-slider');
      var $selectEle = null;
      var $map = $('#'+this.divId);
      $slider.mousedown(function (e) {
        _self.resetLocation();
        $selectEle = $(this);
        gapX=e.clientX-$selectEle[0].offsetLeft;
        gapY=e.clientY-$selectEle[0].offsetTop;		
		$map.mousemove(function (evt) {
			var $swipeViewDiv = $('#swipeViewDiv');
			  evt.preventDefault();
			  if ($selectEle.hasClass('vertical-slider')) {
				$selectEle.css('left', evt.clientX-gapX + 'px');
				$swipeViewDiv.css('clip', 'rect(0px ' + $map.width() + 'px ' + $map.height() + 'px '+ (evt.clientX-gapX) + 'px)');
			  }
			  if ($selectEle.hasClass('horizontal-slider')) {
				$selectEle.css('top', (evt.clientY-gapY) + 'px');
				$swipeViewDiv.css('clip', 'rect('+(evt.clientY-gapY) +'px ' + $map.width() + 'px ' + $map.height() + 'px 0px)');
			  }			
		})
      });
      $slider.mouseup(function () {
		$map.unbind('mousemove')
      });
    },
    resetLocation:function() {
      var _self = this;
      var $allSlider = $('.all-slider');
      $allSlider.each(function () {
        if ($(this).hasClass('left-vertical-slider')) {
          $(this).css('left', '0px');
        }
        if ($(this).hasClass('right-vertical-slider')) {
          $(this).css('right', '0px');
          $(this).css('left', 'auto');
        }
        if ($(this).hasClass('top-horizontal-slider')) {
          $(this).css('top', '0px');
        }
        if ($(this).hasClass('bottom-horizontal-slider')) {
          $(this).css('bottom', '0px');
          $(this).css('top', 'auto');
        }
      });
    },
    /**
     * 销毁
     */
    destroy:function(){
      $("#swipeViewDiv").remove();
      $(".all-slider").remove();
    }	
})
})
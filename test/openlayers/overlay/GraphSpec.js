require('../../../src/openlayers/overlay/Graph');
require('../../resources/chinaConsumptionLevel');

var url = GlobeParameter.China4326URL;
describe('openlayers_graph', function () {
    var originalTimeout;
    var testDiv, map;
    beforeAll(function () {
        testDiv = window.document.createElement("div");
        testDiv.setAttribute("id", "map");
        testDiv.style.styleFloat = "left";
        testDiv.style.marginLeft = "8px";
        testDiv.style.marginTop = "50px";
        testDiv.style.width = "500px";
        testDiv.style.height = "500px";
        window.document.body.appendChild(testDiv);
        map = new ol.Map({
            target: 'map',
            view: new ol.View({
                center: [116.85, 39.79],
                zoom: 0,
                projection: "EPSG:4326"
            })
        });
        var layer = new ol.layer.Tile({
            source: new ol.source.TileSuperMapRest({
                url: url
            })
        });
        map.addLayer(layer);
    });
    beforeEach(function () {
        originalTimeout = jasmine.DEFAULT_TIMEOUT_INTERVAL;
        jasmine.DEFAULT_TIMEOUT_INTERVAL = 50000;
    });
    afterEach(function () {
        jasmine.DEFAULT_TIMEOUT_INTERVAL = originalTimeout;
    });
    afterAll(function () {
        window.document.body.removeChild(testDiv);
        map.remove();
    });

    it('construtor and destroy', function () {
        var barThemeLayer = new ol.source.Graph("BarThemeLayer", "Bar", {
            map: map,
            themeFields: ["CON2009", "CON2010", "CON2011", "CON2012", "CON2013"],
            chartsSetting: {
                width: 240,
                height: 100,
                codomain: [0, 40000],
                barStyle: {fillOpacity: 0.7},
                barHoverStyle: {fillOpacity: 1},
                xShapeBlank: [10, 10, 10],
                axisYTick: 4,
                axisYLabels: ["4万", "3万", "2万", "1万", "0"],
                axisXLabels: ["09年", "10年", "11年", "12年", "13年"],
                backgroundStyle: {fillColor: "#CCE8CF"},
                backgroundRadius: [5, 5, 5, 5],
                showShadow: true,
                barShadowStyle: {
                    shadowBlur: 8,
                    shadowOffsetX: 2,
                    shadowOffsetY: 2,
                    shadowColor: "rgba(100,100,100,0.8)"
                },
                barLinearGradient: [["#00FF00", "#00CD00"], ["#00CCFF", "#5E87A2"], ["#00FF66", "#669985"], ["#CCFF00", "#94A25E"], ["#FF9900", "#A2945E"]]
            }
        });
        expect(barThemeLayer).not.toBeNull();
        expect(barThemeLayer.chartsType).toBe("Bar");
        expect(barThemeLayer.charts.length).toEqual(0);
        var chartsSetting = barThemeLayer.chartsSetting;
        expect(chartsSetting.axisXLabels.length).toEqual(5);
        expect(chartsSetting.axisYLabels.length).toEqual(5);
        expect(chartsSetting.axisYTick).toEqual(4);
        expect(chartsSetting.backgroundRadius.length).toEqual(4);
        expect(chartsSetting.backgroundStyle.fillColor).toBe("#CCE8CF");
        expect(chartsSetting.barHoverStyle.fillOpacity).toEqual(1);
        expect(chartsSetting.barStyle.fillOpacity).toEqual(0.7);
        expect(chartsSetting.barLinearGradient.length).toEqual(5);
        expect(chartsSetting.barShadowStyle).not.toBeNull();
        expect(chartsSetting.codomain.length).toEqual(2);
        expect(chartsSetting.barShadowStyle).not.toBeNull();
        expect(chartsSetting.height).toEqual(100);
        expect(chartsSetting.width).toEqual(240);
        expect(chartsSetting.showShadow).toBeTruthy();
        expect(barThemeLayer.isOverLay).toBeTruthy();
        expect(barThemeLayer.themeFields.length).toEqual(5);
        barThemeLayer.destroy();
    });

    xit('setChartsType', function () {
        var graphThemeSource = new ol.source.Graph("BarThemeLayer", "Bar", {
            map: map,
            chartsSetting: {
                width: 240,
                height: 100,
                codomain: [0, 40000]
            }
        });
        var layer = new ol.layer.Image({
            source: graphThemeSource
        });
        map.addLayer(layer);
        expect(graphThemeSource.chartsType).toBe("Bar");
        graphThemeSource.setChartsType("Line");
        expect(graphThemeSource.chartsType).toBe("Line");
        graphThemeSource.clear();
    });

    xit('addFeatures and removeFeatures', function () {
        var graphThemeSource = new ol.source.Graph("BarThemeLayer", "Bar", {
            map: map
        });
        graphThemeSource.themeFields = ["CON2009", "CON2010", "CON2011", "CON2012", "CON2013"];
        graphThemeSource.chartsSetting = {
            width: 240,
            height: 100,
            codomain: [0, 40000],
            barStyle: {fillOpacity: 0.7},
            barHoverStyle: {fillOpacity: 1},
            xShapeBlank: [10, 10, 10],
            axisYTick: 4,
            axisYLabels: ["4万", "3万", "2万", "1万", "0"],
            axisXLabels: ["09年", "10年", "11年", "12年", "13年"],
            backgroundStyle: {fillColor: "#CCE8CF"},
            backgroundRadius: [5, 5, 5, 5],
            showShadow: true,
            barShadowStyle: {shadowBlur: 8, shadowOffsetX: 2, shadowOffsetY: 2, shadowColor: "rgba(100,100,100,0.8)"},
            barLinearGradient: [["#00FF00", "#00CD00"], ["#00CCFF", "#5E87A2"], ["#00FF66", "#669985"], ["#CCFF00", "#94A25E"], ["#FF9900", "#A2945E"]]
        };
        var layer = new ol.layer.Image({
            source: graphThemeSource
        });
        map.addLayer(layer);
        expect(graphThemeSource.features.length).toEqual(0);
        var features = [];
        for (var i = 0, len = chinaConsumptionLevel.length; i < len; i++) {
            var provinceInfo = chinaConsumptionLevel[i];
            var geometry = new ol.geom.Point([provinceInfo[1], provinceInfo[2]]);
            var atrributes = {};
            atrributes.NAME = provinceInfo[0];
            atrributes.CON2009 = provinceInfo[3];
            atrributes.CON2010 = provinceInfo[4];
            atrributes.CON2011 = provinceInfo[5];
            atrributes.CON2012 = provinceInfo[6];
            atrributes.CON2013 = provinceInfo[7];
            var fea = new ol.supermap.ThemeFeature(geometry, atrributes);
            features.push(fea);
        }
        graphThemeSource.addFeatures(features);
        var LayerFeatures = graphThemeSource.features;
        expect(LayerFeatures.length).toBeGreaterThan(0);
        for (var j = 0; j < LayerFeatures.length; j++) {
            expect(LayerFeatures[j].CLASS_NAME).toBe("SuperMap.Feature.Vector");
            expect(LayerFeatures[j].id).toContain("SuperMap.Feature");
            expect(LayerFeatures[j].attributes).not.toBeNull();
            expect(LayerFeatures[j].geometry).not.toBeNull();
            expect(LayerFeatures[j].geometry.CLASS_NAME).toBe("SuperMap.Geometry.Point");
            expect(LayerFeatures[j].geometry.id).toContain("SuperMap.Geometry");
            expect(LayerFeatures[j].geometry.x).not.toBeNull();
            expect(LayerFeatures[j].geometry.y).not.toBeNull();
        }
        expect(LayerFeatures[0].geometry.x).toEqual(116.407283);
        expect(LayerFeatures[0].geometry.y).toEqual(39.904557);
        expect(LayerFeatures[0].data).toEqual(LayerFeatures[0].attributes);
        expect(LayerFeatures[0].attributes).toEqual(Object({
            CON2009: 22023,
            CON2010: 24982,
            CON2011: 27760,
            CON2012: 30350,
            CON2013: 33337,
            NAME: "北京市"
        }));
        var shape1 = graphThemeSource.getShapesByFeatureID();
        var shape2 = graphThemeSource.getShapesByFeatureID(LayerFeatures[0].id);
        expect(shape1.length).toEqual(17);
        expect(shape2.length).toEqual(5);
        graphThemeSource.features[0].geometry.x = 39;
        var redraw = graphThemeSource.redraw();
        expect(redraw).toBeTruthy();
        expect(graphThemeSource.features[0].geometry.x).toEqual(39);
        graphThemeSource.removeFeatures();
        expect(graphThemeSource.features.length).toBeGreaterThan(0);
        graphThemeSource.removeAllFeatures();
        expect(graphThemeSource.features.length).toEqual(0);
        graphThemeSource.clear();
    });

    it('isQuadrilateralOverLap', function () {
        var graphThemeSource = new ol.source.Graph("BarThemeLayer", "Bar", {
            map: map,
            themeFields: ["CON2009", "CON2010", "CON2011", "CON2012", "CON2013"],
            chartsSetting: {
                width: 240,
                height: 100,
                codomain: [0, 40000]
            }
        });
        var quadrilateral, quadrilateral2;
        quadrilateral = [{"x": 1, "y": 1}, {"x": 3, "y": 1}, {"x": 6, "y": 4}, {"x": 2, "y": 10}, {"x": 1, "y": 1}];
        quadrilateral2 = [{"x": 1, "y": 1}, {"x": 3, "y": 1}, {"x": 6, "y": 4}, {"x": 2, "y": 10}, {"x": 1, "y": 1}];
        var isPointInPoly = graphThemeSource.isQuadrilateralOverLap(quadrilateral, quadrilateral2);
        expect(isPointInPoly).toBeTruthy();
        graphThemeSource.clear();
    });

    // 此方法为iclient8的私有方法,不支持openlayers对象,此处测试传入iclient对象的情况
    it('isPointInPoly', function () {
        var graphThemeSource = new ol.source.Graph("BarThemeLayer", "Bar", {
            map: map,
            themeFields: ["CON2009", "CON2010", "CON2011", "CON2012", "CON2013"],
            chartsSetting: {
                width: 240,
                height: 100,
                codomain: [0, 40000]
            }
        });
        var point = {"x": 2, "y": 5};
        var polygon = [{"x": 1, "y": 1}, {"x": 3, "y": 1}, {"x": 6, "y": 4}, {"x": 2, "y": 10}, {"x": 1, "y": 1}];
        var isPointInPoly = graphThemeSource.isPointInPoly(point, polygon);
        expect(isPointInPoly).toBeTruthy();
        graphThemeSource.clear();
    });

    xit('drawCharts', function (done) {
        var graphThemeSource = new ol.source.Graph("BarThemeLayer", "Bar", {
            map: map,
            themeFields: ["CON2009", "CON2010", "CON2011", "CON2012", "CON2013"],
            chartsSetting: {
                width: 240,
                height: 100,
                codomain: [0, 40000],
                barStyle: {fillOpacity: 0.7},
                barHoverStyle: {fillOpacity: 1},
                xShapeBlank: [10, 10, 10],
                axisYTick: 4,
                axisYLabels: ["4万", "3万", "2万", "1万", "0"],
                axisXLabels: ["09年", "10年", "11年", "12年", "13年"],
                backgroundStyle: {fillColor: "#CCE8CF"},
                backgroundRadius: [5, 5, 5, 5],
                showShadow: true,
                barShadowStyle: {
                    shadowBlur: 8,
                    shadowOffsetX: 2,
                    shadowOffsetY: 2,
                    shadowColor: "rgba(100,100,100,0.8)"
                },
                barLinearGradient: [["#00FF00", "#00CD00"], ["#00CCFF", "#5E87A2"], ["#00FF66", "#669985"], ["#CCFF00", "#94A25E"], ["#FF9900", "#A2945E"]]
            }
        });
        var layer = new ol.layer.Image({
            source: graphThemeSource
        });
        map.addLayer(layer);
        expect(graphThemeSource).not.toBeNull();
        expect(graphThemeSource.context).toBeUndefined();
        graphThemeSource.drawCharts();
        setTimeout(function () {
            expect(graphThemeSource.context).not.toBeUndefined();
            graphThemeSource.clear();
            done();
        }, 3000);
    });

    it('clearCache', function () {
        var graphThemeSource = new ol.source.Graph("BarThemeLayer", "Bar", {
            map: map,
            themeFields: ["CON2009", "CON2010", "CON2011", "CON2012", "CON2013"],
            chartsSetting: {
                width: 240,
                height: 100,
                codomain: [0, 40000]
            }
        });
        graphThemeSource.charts = [1, 2, 3];
        graphThemeSource.cache = {'name': 'ONETWO'};
        expect(graphThemeSource.charts.length).toEqual(3);
        expect(graphThemeSource.cache).toEqual(Object({
            name: "ONETWO"
        }));
        graphThemeSource.clearCache();
        expect(graphThemeSource.charts.length).toEqual(0);
        expect(graphThemeSource.cache).toEqual(Object({}));
        graphThemeSource.clear();
    });
});
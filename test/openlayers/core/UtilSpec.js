require('../../../src/openlayers/core/Util.js');

describe('openlayers_testUtil', function () {
    var originalTimeout;
    beforeEach(function () {
        originalTimeout = jasmine.DEFAULT_TIMEOUT_INTERVAL;
        jasmine.DEFAULT_TIMEOUT_INTERVAL = 50000;
    });
    afterEach(function () {
        jasmine.DEFAULT_TIMEOUT_INTERVAL = originalTimeout;
    });

    it('init', function () {
        new ol.supermap.Util();
    });

    it('toGeoJSON', function () {
        var smObj = [{
            attributes: {
                SmArea: "1.6060069623493825E15",
                SmGeoPosition: "65536",
                SmID: "1",
                SmUserID: "0"
            },
            geometry: {
                coordinateType: null,
                cutEdges: null,
                parts: [3],
                points: [{
                    id: "SuperMap.Geometry.Point_5",
                    type: "NONE",
                    x: -2,
                    y: 258
                }, {
                    id: "SuperMap.Geometry.Point_6",
                    type: "NONE",
                    x: 258,
                    y: 258,
                }, {
                    id: "SuperMap.Geometry.Point_7",
                    type: "NONE",
                    x: 258,
                    y: -2
                }],
                type: "REGION"
            },
            id: 1,
            layerName: "World_Division_pl@China",
            searchValues: "",
            type: "REGION"
        }];
        var result = ol.supermap.Util.toGeoJSON(smObj);
        expect(result).not.toBeNull();
        expect(typeof result).toBe('object');
        expect(result.type).not.toBeNull();
        expect(result.type).toBe("FeatureCollection");
        expect(result.features).not.toBeNull();
        expect(result.features.length).toBe(1);
        expect(result.features[0].properties.id).toBe(1);
        expect(result.features[0].properties.layerName).toBe("World_Division_pl@China");
        expect(result.features[0].properties.searchValues).toBe("");
        expect(result.features[0].properties.type).toBe("REGION");
    });

    it('toSuperMapGeometry', function () {
        var geoJSON = {
            "type": "FeatureCollection",
            "features": [{
                "type": "Feature",
                "properties": {
                    "attributes": {
                        "SmArea": "1.6060069623493825E15",
                        "SmGeoPosition": "65536",
                        "SmID": "1",
                        "SmPerimeter": "1.6030006674231339E8",
                    }, "id": 1, "layerName": "World@China", "searchValues": "", "type": "REGION"
                },
                "geometry": {
                    "type": "MultiPolygon", "coordinates": [[[
                        [-2, 258], [258, 258], [-2, 258], [-2, 258]
                    ]]]
                }
            }]
        };
        var result = ol.supermap.Util.toSuperMapGeometry(geoJSON);
        expect(result).not.toBeNull();
        expect(result instanceof SuperMap.Geometry.MultiPolygon).toBeTruthy();
        expect(result.id).not.toBeNull();
        expect(result.components).not.toBeNull();
        expect(result.components.length).toBe(1);

        var polygon = result.components[0];
        expect(polygon instanceof SuperMap.Geometry.Polygon).toBeTruthy();
        expect(polygon.components).not.toBeNull();
        expect(polygon.components.length).toBe(1);

        var lineString = polygon.components[0];
        expect(lineString instanceof SuperMap.Geometry.LinearRing).toBeTruthy();
        expect(lineString.components).not.toBeNull();
        expect(lineString.components.length).toBe(3);

        var point = lineString.components[0];
        expect(point instanceof SuperMap.Geometry.Point).toBeTruthy();
        expect(point.x).toBe(-2);
        expect(point.y).toBe(258);
    });

    it('resolutionToScale', function () {
        var resolution = 76.43702828517625;
        var dpi = 96;
        var mapUnit = "METER";
        var result = ol.supermap.Util.resolutionToScale(resolution, dpi, mapUnit);
        expect(result).toBe(0.000003461454994642238);
    });

    it('toSuperMapBounds', function () {
        var bounds = [-2640403.6321084504, 1873792.1034850003, 3247669.390292245, 5921501.395578556];
        var result = ol.supermap.Util.toSuperMapBounds(bounds);
        expect(result).not.toBeNull();
        expect(result instanceof SuperMap.Bounds).toBeTruthy();
        expect(result.bottom).toBe(1873792.103485);
        expect(result.left).toBe(-2640403.6321085);
        expect(result.right).toBe(3247669.3902922);
        expect(result.top).toBe(5921501.3955786);
    });


    it('scaleToResolution', function () {
        var scale = 0.000003461454994642238;
        var dpi = 96;
        var mapUnit = "METER";
        var result = ol.supermap.Util.scaleToResolution(scale, dpi, mapUnit);
        expect(result).not.toBeNull();
        expect(result).toBe(76.43702828517624);
    });


    it('getMeterPerMapUnit', function () {
        var mapUnit = "METER";
        var result = ol.supermap.Util.getMeterPerMapUnit(mapUnit);
        expect(result).toBe(1);
        mapUnit = "DEGREE";
        result = ol.supermap.Util.getMeterPerMapUnit(mapUnit);
        expect(result).toBe(111319.49079327358);
        mapUnit = "KILOMETER";
        result = ol.supermap.Util.getMeterPerMapUnit(mapUnit);
        expect(result).toBe(0.001);
        mapUnit = "INCH";
        result = ol.supermap.Util.getMeterPerMapUnit(mapUnit);
        expect(result).toBe(39.37007886725774);
        mapUnit = "FOOT";
        result = ol.supermap.Util.getMeterPerMapUnit(mapUnit);
        expect(result).toBe(0.3048);
    });

    it('isArray', function () {
        var obj = ["metaData", "-2107465189", "1.0"];
        var result = ol.supermap.Util.isArray(obj);
        expect(result).toBeTruthy();
    });

    it('Csv2GeoJSON', function () {
        var csv = `type,lon,lat
                Point,106.472739,29.561524
                ↵Point,106.471445,29.563047
                ↵Point,106.478919,29.566165
                ↵Point,106.481201,29.565882
                ↵Point,106.531919,29.62826`;
        var option = {
            titles: ['type', 'lon', 'lat'],
            latitudeTitle: 'lat',
            longitudeTitle: 'lon',
            fieldSeparator: ',',
            lineSeparator: '\n',
            deleteDoubleQuotes: true,
            firstLineTitles: true
        };
        var result = ol.supermap.Util.Csv2GeoJSON(csv, option);
        expect(typeof result).toBe('object');
        expect(result.type).toBe("FeatureCollection");
        expect(result.features).not.toBeNull();
        expect(result.features.length).toBe(5);

        var feature = result.features[0];
        expect(feature).not.toBeNull();
        expect(feature.type).toBe('Feature');
        expect(feature.properties).not.toBeNull();
        expect(feature.properties.type).toBe('Point');
        expect(feature.geometry).not.toBeNull();
        expect(feature.geometry.type).toBe('Point');
        expect(feature.geometry.coordinates).not.toBeNull();
        expect(feature.geometry.coordinates.length).toBe(2);
        expect(JSON.stringify(feature.geometry.coordinates)).toBe("[106.472739,29.561524]");
    });

    it('createCanvasContext2D', function () {
        var opt_width = 360;
        var opt_height = 580;
        var result = ol.supermap.Util.createCanvasContext2D(opt_width, opt_height);
        expect(result).not.toBeNull();
        expect(result instanceof CanvasRenderingContext2D).toBeTruthy();
        expect(result.canvas).not.toBeNull();
        expect(result.canvas.width).toBe(360);
        expect(result.canvas.height).toBe(580);
    });

});
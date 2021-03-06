﻿import SuperMap from '../SuperMap';
import {Util} from './Util';

/**
 * @class SuperMap.LonLat
 * @classdesc  这个类用来表示经度和纬度对。
 * @param lon - {number} 地图单位上的X轴坐标，如果地图是地理投影，则此值是经度，否则，此值是地图地理位置的x坐标。
 * @param lat - {number} 地图单位上的Y轴坐标，如果地图是地理投影，则此值是纬度，否则，此值是地图地理位置的y坐标。
 * @param location - {Array<float>} [lon, lat]  如果要同时设置，则使用传入横纵坐标组成的数组。
 * @example
 * var lonLat = new SuperMap.LonLat(30,45);
 */
export default class LonLat {

    /**
     * @member SuperMap.LonLat.prototype.lon  -{float}
     * @description 地图的单位的X轴（横轴）坐标，默认为0.0。
     */
    lon = 0.0;

    /**
     * @member SuperMap.LonLat.prototype.lat  -{float}
     * @description 地图的单位的Y轴（纵轴）坐标，默认为0.0。
     */
    lat = 0.0;

    constructor(lon, lat) {
        if (Util.isArray(lon)) {
            lat = lon[1];
            lon = lon[0];
        }
        this.lon = lon ? Util.toFloat(lon) : this.lon;
        this.lat = lat ? Util.toFloat(lat) : this.lat;
    }

    /**
     * @function SuperMap.LonLat.prototype.toString
     * @description 返回此对象的字符串形式
     * @example
     * var lonLat = new SuperMap.LonLat(100,50);
     * var str = lonLat.toString();
     * @returns {string} 例如: "lon=100,lat=50"
     */
    toString() {
        return ("lon=" + this.lon + ",lat=" + this.lat);
    }

    /**
     * @function SuperMap.LonLat.prototype.toShortString
     * @description 将经度纬度转换成简单字符串。
     * @example
     * var lonLat = new SuperMap.LonLat(100,50);
     * var str = lonLat.toShortString();
     * @returns {string} 返回处理后的经纬度字符串。例如："100,50"
     */
    toShortString() {
        return (this.lon + "," + this.lat);
    }

    /**
     * @function SuperMap.LonLat.prototype.clone
     * @description 复制坐标对象，并返回复制后的新对象。
     * @example
     * var lonLat1 = new SuperMap.LonLat(100,50);
     * var lonLat2 = lonLat1.clone();
     * @returns {SuperMap.LonLat}  返回相同坐标值的新的坐标对象。
     */
    clone() {
        return new LonLat(this.lon, this.lat);
    }

    /**
     * @function SuperMap.LonLat.prototype.add
     * @description 在已有坐标对象的经纬度基础上加上新的坐标经纬度，并返回新的坐标对象。
     * @example
     * var lonLat1 = new SuperMap.LonLat(100,50);
     * //lonLat2 是新的对象
     * var lonLat2 = lonLat1.add(100,50);
     *
     * @param lon - {float} 传入的精度参数。
     * @param lat - {float} 传入的纬度参数。
     * @returns {SuperMap.LonLat} 返回一个新的LonLat对象，此对象的经纬度是由传
     *      入的经纬度与当前的经纬度相加所得。
     */
    add(lon, lat) {
        if ((lon == null) || (lat == null)) {
            throw new TypeError('LonLat.add cannot receive null values');
        }
        return new LonLat(this.lon + Util.toFloat(lon),
            this.lat + Util.toFloat(lat));
    }

    /**
     * @function SuperMap.LonLat.prototype.equals
     * @description 判断两个坐标对象是否相等。
     * @example
     * var lonLat1 = new SuperMap.LonLat(100,50);
     * var lonLat2 = new SuperMap.LonLat(100,50);
     * var isEquals = lonLat1.equals(lonLat2);
     *
     * @param ll - {SuperMap.LonLat} 需要进行比较的坐标对象。
     * @returns {boolean} 如果LonLat对象的经纬度和传入的经纬度一致则返回true,不一
     *      致或传入的ll参数为NULL则返回false。
     */
    equals(ll) {
        var equals = false;
        if (ll != null) {
            equals = ((this.lon === ll.lon && this.lat === ll.lat) ||
            (isNaN(this.lon) && isNaN(this.lat) && isNaN(ll.lon) && isNaN(ll.lat)));
        }
        return equals;
    }

    /**
     * @function SuperMap.LonLat.prototype.wrapDateLine
     * @description 通过传入的范围对象对坐标对象转换到该范围内。
     * 如果经度小于给定范围最小精度，则在原经度基础上加上范围宽度，
     * 直到精度在范围内为止，如果经度大于给定范围则在原经度基础上减去范围宽度。
     * 换句话说就是将不在经度范围内的坐标转换到范围以内。
     *  （只会转换lon，不会转换lat，主要用于转移到日界线以内）
     * @example
     * var lonLat1 = new SuperMap.LonLat(420,50);
     * var lonLat2 = lonLat1.wrapDateLine(
     *      new SuperMap.Bounds(-180,-90,180,90)
     *  );
     *
     * @param maxExtent - {SuperMap.Bounds} 最大边界的范围。
     * @returns {SuperMap.LonLat} 将坐标转换到范围对象以内，并返回新的坐标。
     */
    wrapDateLine(maxExtent) {

        var newLonLat = this.clone();

        if (maxExtent) {
            //shift right?
            while (newLonLat.lon < maxExtent.left) {
                newLonLat.lon += maxExtent.getWidth();
            }

            //shift left?
            while (newLonLat.lon > maxExtent.right) {
                newLonLat.lon -= maxExtent.getWidth();
            }
        }

        return newLonLat;
    }

    /**
     *
     * @function SuperMap.LonLat.prototype.destroy
     * @description 销毁此对象。
     * 销毁后此对象的所有属性为null，而不是初始值。
     * @example
     * var lonLat = new SuperMap.LonLat(100,50);
     * lonLat.destroy();
     */
    destroy() {
        this.lon = null;
        this.lat = null;
    }

    /**
     * @function SuperMap.LonLat.fromString
     * @description 通过字符串生成一个<SuperMap.LonLat>对象
     * @example
     * var str = "100,50";
     * var lonLat = SuperMap.LonLat.fromString(str);
     *
     * @param str - {string} 字符串的格式：Lon+","+Lat。如："100,50"
     * @returns {SuperMap.LonLat} 返回一个 <SuperMap.LonLat> 对象
     */
    static fromString(str) {
        var pair = str.split(",");
        return new LonLat(pair[0], pair[1]);
    }

    /**
     * @function SuperMap.LonLat.fromArray
     * @description 通过数组生成一个<SuperMap.LonLat>对象
     * @param arr - {Array<float>} 数组的格式，长度只能为2,：[Lon,Lat]。如： [5,-42]
     * @returns {SuperMap.LonLat} 返回一个 <SuperMap.LonLat> 对象
     */
    static fromArray(arr) {
        var gotArr = Util.isArray(arr),
            lon = gotArr && arr[0],
            lat = gotArr && arr[1];
        return new LonLat(lon, lat);
    }

    CLASS_NAME = "SuperMap.LonLat"
}
SuperMap.LonLat = LonLat;

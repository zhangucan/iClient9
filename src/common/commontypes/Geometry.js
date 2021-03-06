﻿import SuperMap from '../SuperMap';
import WKT from '../format/WKT';
import Vector from './Vector';
import {Util} from './Util';

/**
 * @class SuperMap.Geometry
 * @classdesc 几何对象类，描述地理对象的几何图形。
 */
export default class Geometry {

    /**
     * @member SuperMap.Geometry.prototype.id -{string}
     * @description  此几何对象的唯一标示符。
     *
     */
    id = null;

    /**
     * @member SuperMap.Geometry.prototype.parent -{SuperMap.Geometry}
     * @description This is set when a Geometry is added as component
     * of another geometry
     */
    parent = null;

    /**
     * @member SuperMap.Geometry.prototype.bounds -{SuperMap.Bounds}
     * @description 几何对象的范围
     *
     */
    bounds = null;

    /**
     * @member SuperMap.Geometry.prototype.SRID -{interger}
     * @description 投影坐标参数。通过该参数，服务器判断Geometry对象的坐标参考系是否与数据集相同，如果不同，则在数据入库前进行投影变换。
     * @example
     *   var geometry= new SuperMap.Geometry();
     *   geometry. SRID=4326;
     *
     */
    SRID = null;

    constructor() {
        this.id = Util.createUniqueID(this.CLASS_NAME + "_");
    }


    /**
     * @function SuperMap.Geometry.prototype.destroy
     * @description 解构Geometry类，释放资源。
     */
    destroy() {
        this.id = null;
        this.bounds = null;
        this.SRID = null;
    }


    /**
     * @function SuperMap.Geometry.prototype.clone
     * @description 创建克隆的几何图形。克隆的几何图形不设置非标准的属性。
     * @returns {SuperMap.Geometry} 克隆的几何图形。
     */
    clone() {
        return new Geometry();
    }


    /**
     * @function SuperMap.Geometry.prototype.setBounds
     * @description 设置此几何对象的bounds。
     * @param bounds - {SuperMap.Bounds}
     */
    setBounds(bounds) {
        if (bounds) {
            this.bounds = bounds.clone();
        }
    }


    /**
     * @function SuperMap.Geometry.prototype.clearBounds
     * @description 清除几何对象的bounds。
     * 如果该对象有父类，也会清除父类几何对象的bounds。
     */
    clearBounds() {
        this.bounds = null;
        if (this.parent) {
            this.parent.clearBounds();
        }
    }


    /**
     * @function SuperMap.Geometry.prototype.extendBounds
     * @description Extend the existing bounds to include the new bounds.
     * If geometry's bounds is not yet set, then set a new Bounds.
     *
     * @param newBounds - {SuperMap.Bounds}
     */
    extendBounds(newBounds) {
        var bounds = this.getBounds();
        if (!bounds) {
            this.setBounds(newBounds);
        } else {
            this.bounds.extend(newBounds);
        }
    }


    /**
     * @function SuperMap.Geometry.prototype.getBounds
     * @description 获得几何图形的边界。如果没有设置边界，可通过计算获得。
     * @returns {SuperMap.Bounds}返回的几何对象的边界。
     */
    getBounds() {
        if (this.bounds == null) {
            this.calculateBounds();
        }
        return this.bounds;
    }


    /**
     * @function SuperMap.Geometry.prototype.calculateBounds
     * @description 重新计算几何图形的边界。（需要在子类中实现此方法）
     */
    calculateBounds() {
        //
        // This should be overridden by subclasses.
        //
    }

    /**
     * @function SuperMap.Geometry.prototype.getVertices
     * @description 返回几何图形的所有顶点的列表。（需要在子类中实现此方法）
     * @param nodes - {Boolean} 如果是true，线则只返回线的末端点，如果false，仅仅返回顶点，如果没有设置，则返回顶点。
     * @returns {Array} 几何图形的顶点列表。
     */
    getVertices(nodes) {
    }

    /**
     * @function SuperMap.Geometry.prototype.getArea
     * @description 计算几何对象的面积 ，此方法需要在子类中定义  。
     * @returns {float} The area of the collection by summing its parts
     */
    getArea() {
        //to be overridden by geometries that actually have an area
        //
        return 0.0;
    }


    /**
     * @function SuperMap.Geometry.prototype.toString
     * @description 返回geometry对象的字符串表述，需要引入{@link SuperMap.Format.WKT}。此方法只能在子类实现，在父类使用会报错。
     * @returns {string} geometry对象的字符串表述(Well-Known Text)
     */
    toString() {
        var string;
        if (WKT) {
            var wkt = new WKT();
            string = wkt.write(new Vector(this));
        } else {
            string = Object.prototype.toString.call(this);
        }
        return string;
    }

    CLASS_NAME = "SuperMap.Geometry"
}
SuperMap.Geometry = Geometry;

﻿/* COPYRIGHT 2017 SUPERMAP
 * 本程序只能在有效的授权许可下使用。
 * 未经许可，不得以任何手段擅自使用或传播。*/

/**
 * Class: SuperMap.REST.GetFieldsService
 * 字段查询服务，支持查询指定数据集的中所有属性字段（field）的集合。
 *
 * Inherits from:
 *  - <SuperMap.CoreServiceBase>
 */
require('./CoreServiceBase');

SuperMap.REST.GetFieldsService = SuperMap.Class(SuperMap.CoreServiceBase, {

    /**
     * APIProperty: datasource
     * {String} 要查询的数据集所在的数据源名称。
     */
    datasource: null,

    /**
     * APIProperty: dataset
     * {String} 要查询的数据集名称。
     */
    dataset: null,

    /**
     * Constructor: SuperMap.REST.GetFieldsService
     * 字段查询服务构造函数。
     *
     * 例如：
     * (start code)
     * var myService = new SuperMap.REST.GetFieldsService(url, {eventListeners: {
     *     "processCompleted": getFieldsCompleted, 
     *     "processFailed": getFieldsError
     *     },
     *     datasource: "World",
     *     dataset: "Countries"
     * };
     * (end)
     *
     * Parameters:
     * url - {String} 服务的访问地址。如访问World Map服务，只需将url设为: http://localhost:8090/iserver/services/data-world/rest/data 即可。
     * options - {Object} 参数。
     *
     * Allowed options properties:
     * eventListeners - {Object} 需要被注册的监听器对象。
     * datasource - {String}
     * dataset - {String}
     */
    initialize: function (url, options) {
        SuperMap.CoreServiceBase.prototype.initialize.apply(this, arguments);
    },

    /**
     * APIMethod: destroy
     * 释放资源,将引用资源的属性置空。
     */
    destroy: function () {
        SuperMap.CoreServiceBase.prototype.destroy.apply(this, arguments);
        var me = this;
        me.datasource = null;
        me.dataset = null;
    },

    /**
     * APIMethod: processAsync
     * 执行服务，查询指定数据集的字段信息。
     */
    processAsync: function () {
        var me = this,
            end = me.url.substr(me.url.length - 1, 1),
            datasetURL = "datasources/" + me.datasource + "/datasets/" + me.dataset;
        if (me.isInTheSameDomain) {
            me.url += (end == "/") ? datasetURL + "/fields.json?" : "/" + datasetURL + "/fields.json?";
        } else {
            me.url += (end == "/") ? datasetURL + "fields.jsonp?" : "/" + datasetURL + "/fields.jsonp?";
        }

        me.request({
            method: "GET",
            data: null,
            scope: me,
            success: me.serviceProcessCompleted,
            failure: me.serviceProcessFailed
        });
    },

    CLASS_NAME: "SuperMap.REST.GetFieldsService"
});

module.exports = function (url, options) {
    return new SuperMap.REST.GetFieldsService(url, options);
};
const {
  MAIN_ACCESS_KEY_ID, MAIN_ACCESS_KEY_SECRET
} = process.env;
const OSS= require('ali-oss');
const AlipopCore = require('@alicloud/pop-core');
const { 
  handleGClientIP
} = require('./src/network');

const {
  handleRmLocal,
  handleLoadSourceByStream,
  handleUploadFile,
} = require('./src/file_system');

exports.register = function (server, options, next) {
  // 初始化 alioss
  const alioss = {
      ['Region-beijing']: new OSS({
          accessKeyId: MAIN_ACCESS_KEY_ID,
          accessKeySecret: MAIN_ACCESS_KEY_SECRET,
          internal: false,
          region: 'oss-cn-beijing',
          bucket: 'yuntun-web',
      }),
      ['Region-shanghai']: new OSS({
          accessKeyId: MAIN_ACCESS_KEY_ID,
          accessKeySecret: MAIN_ACCESS_KEY_SECRET,
          internal: false,
          region: 'oss-cn-shanghai',
          bucket: 'yuntun-avatar',
      })
  }

  const aliclient = override_option => new AlipopCore({
    accessKeyId: process.env.MAIN_ACCESS_KEY_ID,
    accessKeySecret: process.env.MAIN_ACCESS_KEY_SECRET,
    endpoint: `https://facebody.cn-shanghai.aliyuncs.com`,
    apiVersion: '2019-12-30',
    ...override_option
  });

  // 工具库
  const { wx_tpl } = require('./src/template');
  server.expose('utils', {
      alioss,
      aliclient,
      co: require('co'),
      superagent: require('superagent'),
      moment: require('moment'),
      crypto: require('crypto'),
      xml2js: require('xml2js'),
      request: require('request'),
      stream: require('stream'),
      Promise: require('bluebird'),
      wxcompile: require('lodash').template(wx_tpl),
      tempfile: require('tempfile'),
      tmpdir: require('os').tmpdir,
      fs: require('fs'),
      path: require('path'),
      util: require('util'),
      execa: require('execa'),
      dot: require('dot-object'),
      xlsx: require('node-xlsx'),
      md5: require('md5'),
      shortid: require('shortid'),
      JWT: require('jsonwebtoken'),
      cpy: require('cpy'),
  });

  const _this = server.plugins['luna-methods'];
  // network
  server.method('GClientIP', handleGClientIP.bind(_this));

  // file upload
  server.method('rmLocal', handleRmLocal.bind(_this));
  server.method('loadSourceByStream', handleLoadSourceByStream.bind(_this));
  server.method('uploadFile', handleUploadFile.bind(_this))
}
exports.name = 'luna-methods';
exports.multiple = false;
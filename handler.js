const {
  MAIN_ACCESS_KEY_ID, MAIN_ACCESS_KEY_SECRET
} = process.env;
const OSS= require('ali-oss');
const { 
  handleGClientIP
} = require('./src/network');

const {
  handleGClientIP,
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

  // 工具库
  server.expose('utils', {
      alioss,
      co: require('co'),
      superagent: require('superagent'),
      moment: require('moment'),
      crypto: require('crypto'),
      xml2js: require('xml2js'),
      request: require('request'),
      stream: require('stream'),
      Promise: require('bluebird'),
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
  });

  // network
  server.method('GClientIP', handleGClientIP.bind(this));

  // file upload
  server.method('rmLocal', handleRmLocal.bind(this));
  server.method('loadSourceByStream', handleLoadSourceByStream.bind(this));
  server.method('uploadFile', handleUploadFile.bind(this))
}
exports.name = 'luna-methods';
exports.multiple = false;
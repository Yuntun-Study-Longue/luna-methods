function handleRmLocal(FILE_PATH) {
  const { fs } = this.utils;
  if ( fs.existsSync(FILE_PATH) ) fs.unlinkSync(FILE_PATH);
}
async function handleLoadSourceByStream(STREAM, FILE_NAME) {
  const { tmpdir, path, fs } = this.utils;
  const filepath = path.resolve(tmpdir(), FILE_NAME);
  const fileStream = fs.createWriteStream(filepath);
  STREAM.pipe(fileStream);
  return new Promise( (resolve, reject)=> {
      fileStream.on('finish', ()=> resolve(filepath) );
  });
}
async function handleUploadFile(localFile) {
  const { Promise, co, alioss, md5 } = this.utils;
  const timestamp = new Date().getTime();
  const key = md5(localFile + timestamp);

  return new Promise( (resolve, reject)=> {
      co(function*(){
      const result = yield alioss['Region-beijing'].put(key, localFile);
      yield alioss['Region-beijing'].putACL(key, 'public-read');

      if (result.url) {
          resolve({ code: 0, data: { ali_url: result.url } });
      } else resolve({ code: -1, msg: '上传失败' });
      })
  });
}


module.exports = {
  handleRmLocal,
  handleLoadSourceByStream,
  handleUploadFile,
}
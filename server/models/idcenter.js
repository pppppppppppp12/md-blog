import { blog } from '../config/db.js'
import md5 from 'md5'

const idKvs = {
  'AUTOID_USER': 100,
  'AUTOID_DOCUMENT': 101,
  'AUTOID_DOCUMENT_LOGS': 102,
  'AUTOID_PROJECT': 103,
  'AUTOID_FILE': 104
}

const getAutoId = async function (k, count = 1) {
  if (Object.prototype.toString.call(k) !== '[object Number]') {
    throw new Error('没有该类型id')
  }

  if ((k < 1) || (k > 65535)) {
    throw new Error('get_auto_id key invalid, 0<$k<65536 required.')
  }

  let ret = false

  try {
    await blog.query('update idcenter set id=last_insert_id(id + ' + count + ') where k = ' + k).spread((results, metadata) => {
      console.log(metadata)
      if (metadata.affectedRows === 0) {
        ret = false
        return
      }
      ret = true
    })
  } catch (error) {
    ret = false
    console.log(error)
  }

  if (!ret) {
    await blog.query('insert into idcenter (k,id) values (' + k + ',0)', {type: blog.QueryTypes.INSERT})
    ret = await blog.query('update idcenter set id=last_insert_id(id+' + count + ') where k=' + k, {type: blog.QueryTypes.UPDATE})
  }

  ret = await blog.query('select last_insert_id() as id', {type: blog.QueryTypes.SELECT})
  ret = ret ? ret[0].id : false
  return ret
}

const getMd5AutoId = async function (k) {
  let id = await getAutoId(k) // 获取最新插入的id
  id = md5(id + '0123456789')
  return id
}

export default {
  idKvs,
  getAutoId,
  getMd5AutoId
}

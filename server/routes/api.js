import project from '../controllers/project.js'
import document from '../controllers/document.js'
import koaRouter from 'koa-router'

const router = koaRouter()

router.post('/project_list', project.projectList)
router.post('/create_project', project.createProject)
router.post('/update_project', project.updateProject)
router.post('/remove_project', project.removeProject)

router.post('/doc_list', document.docList)
router.post('/create_doc', document.createDoc)
router.post('/create_file', document.createFile)
router.post('/update_doc', document.updateDoc)
router.post('/remove_doc', document.removeDoc)

export default router

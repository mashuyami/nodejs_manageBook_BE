import db from '../models'
import { Op } from 'sequelize'
//page : phan trang ,lay trang 1 hay 2 hay 3
//limit : trang lay bao nhieu du lieu
//order : sap xep
const cloudinary = require('cloudinary').v2;
import {v4 as generateId} from 'uuid'
export const getBooks = ({ page, limit, order, name, available, ...query }) => new Promise(async (resolve, reject) => {
    try {
        const queries = { raw: true, nest: true }
        // neu khong co trang hay trang du lieu nho hon 1 thi xap xep se bang 0 con neu nguoc lai thi trang tru di 1 hay + 1   
        const offset = (!page || +page <= 1) ? 0 : (+page - 1)
        const fLimit = +limit || +process.env.LIMIT_BOOK
        queries.offset = offset * fLimit
        queries.limit = fLimit
        if (order) queries.order = [order]
        if (name) query.title = {
            [Op.substring]: name
        }
        //tim gia tri theo khoang
        if (available) query.available = { [Op.between]: available }
        //ham findandcoutall de phan trang = findALL+ count all
        const response = await db.Book.findAndCountAll({
            where: query,
            ...queries,
            attributes: {
                exclude: ['category_code']
            }
            ,
            include: [
                { model: db.Category, attributes: { exclude: ['createdAt', 'updatedAt'] }, as: 'categoryData' }
            ]


        })
        resolve({
            err: response ? 0 : 1,
            mes: response ? 'Got' : 'Canot found book',
            //truoc baker thuong 1 dau cach
            bookData: response
        })
    } catch (error) {
        reject(error)
    }
})
//CREATE
export const createNewBook = (body,fileData) => new Promise(async (resolve, reject) => {
    try {
        const response = await db.Book.findOrCreate({
            where:{title: body?.title},
            defaults:{
                ...body,
                id:generateId(),
                image: fileData?.path,
                filename: fileData?.filename
            
            }
            })
        resolve({
            err: response[1] ? 0 : 1,
            mes: response[1] ? 'Created' : 'Canot create new  book',
        })
        //check truong loi
        if(fileData && !response[1]) cloudinary.uploader.destroy(fileData.filename)
    } catch (error) {
        reject(error)
        if(fileData && !response[1]) cloudinary.uploader.destroy(fileData.filename)
    }
})
//UPDATE
export const updateBook = ({bid,...body},fileData) => new Promise(async (resolve, reject) => {
    try {
            if(fileData) body.image = fileData?.path
        const response = await db.Book.update(body,{
      where: {id:bid}
            })

        resolve({
            err: response[0] > 0 ?0: 1,
            mes: response[0]>0 ? `${response[0]} book updated` : 'Canot update  book',
        })
        //check truong loi
        if(fileData && !response[0]==0) cloudinary.uploader.destroy(fileData.filename)
    } catch (error) {
        reject(error)
        if(fileData) cloudinary.uploader.destroy(fileData.filename)
    }
})

//DELETE

export const deleteBook = (bids,filename) => new Promise(async (resolve, reject) => {
    try {
        const response = await db.Book.destroy({
      where: {id:bids}
            })

        resolve({
            err: response > 0 ?0: 1,
            mes: response>0 ? `${response} book(s) delte` : 'Canot delete  book',
        })
      cloudinary.api.delete_resources(filename)
    } catch (error) {
        reject(error)
    }
})
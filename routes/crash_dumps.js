/**
 * Created by Mikael Lindahl (mikael) on 10/9/16.
 */

'use strict';

const Joi = require('joi');
const handler = require('../index').methods.handler;
const Formidable = require('formidable');
const debug = require('debug')('breakpad:route:crash_dumps');
const Minidump = require('minidump');
const Fs=require('fs');
const Path=require('path');

module.exports = [
    {
        method: 'POST',
        path:'/crash_dumps',
        handler: (request, reply)=>{

            //let file=Path.join(Path.resolve(), 'tmp')
            //Fs.writeFileSync(file, request.payload.upload_file_minidump)
            //Minidump.walkStack(file, (error, report)=>{
            //    debug(record)
            //    debug(error, report.toString())
            //    reply(record)
            //})

            let record={
                user_agent:request.headers['user-agent'],
                product:request.payload.prod,
                version:request.payload.ver,
                ip:request.info.remoteAddress,
                file: request.payload.upload_file_minidump
            };

            var Model = request.server.getModel('crash_dump');

            Model.create(record).then((models)=>{

                reply(models).code(201);

            }).catch(function (err) {

                request.server.app.log.error(err);
                reply(Boom.badImplementation(err.message));

            });/**/



        },//handler.create({model:'crash_dump'}),
        config: {

            //auth:'jwt',
            description: 'Create crash dump',
            notes: 'Creates an crash dump',
            tags: ['api', 'crash_dump'],
            plugins: {
                'hapi-swagger': {
                    payloadType: 'form'
                }
            },
            validate: {
                options: {
                    allowUnknown: true
                },
                //headers: {
                //    Authorization: Joi.string().description('Jwt token')
                //},
                payload: {
                    prod: Joi.string().required().description('Software'),
                    ver:  Joi.string().required().description('Software version crash dump belong to'),
                    upload_file_minidump: Joi.binary().required().description('Crash dump file'),
                }
            }
        }
    },

    {
        method: 'GET',
        path:'/crash_dumps',
        handler: (request, reply)=>{


            let Model = request.server.getModel('crash_dump');

            Model.find().then((models)=>{

                reply(models);

            }).catch(function (err) {

                request.server.app.log.error(err);
                reply(Boom.badImplementation(err.message));

            });

        },//handler.getAll({model:'crash_dump'}),
        config: {
            description: 'Get all crash dumps',
            notes: 'Gets all crash dumps',
            tags: ['api', 'crash_dump'],
            plugins: {
                'hapi-swagger': {
                    responseMessages: [
                        { code: 404, message: 'Not found' }
                    ]
                }
            },
            validate: {
                options: {
                    allowUnknown: true
                },
                headers: {
                    Authorization: Joi.string().description('Jwt token')
                },
            }
        }
    },
];
/**
 * Created by Mikael Lindahl (mikael) on 10/9/16.
 */

'use strict';

const Joi = require('joi');
const handler = require('../index').methods.handler;

module.exports = [
    {
        method: 'POST',
        path:'/symbols',
        handler: handler.create({model:'symbol'}),
        config: {
            auth:'jwt',
            description: 'Create symbol file entry',
            notes: 'Creates an symbol file entry',
            tags: ['api', 'symbol'],
            plugins: {
                'hapi-swagger': {
                    payloadType: 'form'
                }
            },
            validate: {
                options: {
                    allowUnknown: true
                },
                headers: {
                    Authorization: Joi.string().description('Jwt token')
                },
                payload: {
                    version:  Joi.string().required().description('Software version symbol file belong to'),
                    crash_dump: Joi.binary().required().description('Symbol file'),
                }
            }
        }
    },

    {
        method: 'GET',
        path:'/symbols',
        handler: handler.getAll({model:'symbol'}),
        config: {
            auth:'jwt',
            description: 'Get all symbol files',
            notes: 'Gets all symbols files',
            tags: ['api', 'symbol'],
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
/**
 * Created by mikael on 9/23/16.
 */
'use strict';

const Boom=require('boom')



function create (options) {
    return (request, reply)=> {
        var payload = request.payload;

        var Model = request.server.getModel(options.model);

        payload.user_id = request.auth.credentials.user_id;

        Model.create(payload).then((models)=>{

            reply(models).code(201);

        }).catch(function (err) {

            request.server.app.log.error(err);
            reply(Boom.badImplementation(err.message));

        });/**/
    }
}

function update (options) {
    return (request, reply)=> {

        let payload = request.payload;

        let Model = request.server.getModel(options.model);

        let key=options.id ? options.id : 'id';

        Model.update({[key]: payload[key]}, payload).then((models)=>{

            reply(models[0]);

        }).catch(function (err) {

            request.server.app.log.error(err);
            reply(Boom.badImplementation(err.message));

        });
    }
}

function getAll (options) {
    return (request, reply)=> {

        let Model = request.server.getModel(options.model);

        Model.findByUser_id(request.auth.credentials.user_id).then((models)=>{

            reply(models);

        }).catch(function (err) {

            request.server.app.log.error(err);
            reply(Boom.badImplementation(err.message));

        });
    }
}

function getOne (options) {
    return (request, reply)=> {

        let Model = request.server.getModel(options.model);

        let key=options.id ? options.id : 'id';

        Model.findOne('' + request.params[key]).then( (models)=>{

            if (!models || models.length < 1) {
                return reply(Boom.notFound());
            }

            reply(models);

        }).catch(function (err) {

            request.server.app.log.error(err);
            reply(Boom.badImplementation(err.message));

        });
    }
}

function destroy (options) {
    return (request, reply)=> {

        let key=options.id ? options.id : 'id';

        let Model = request.server.getModel(options.model);

        Model.destroy(request.params[key]).then((models)=>{

            if (models.length==0) return reply( Boom.notFound('No model'));

            return reply({[key]: request.params[key]}).code(200);

        }).catch(function (err) {

            request.server.app.log.error(err);
            reply(Boom.badImplementation(err.message));

        });
    }
}

exports.register = function (server, options, next) {

    server.method([
        {
            name: 'handler.create',
            method: create,
            options: {}
        },
        {
            name: 'handler.update',
            method: update,
            options: {}
        },
        {
            name: 'handler.getAll',
            method: getAll,
            options: {}
        },
        {
            name: 'handler.getOne',
            method: getOne,
            options: {}
        },
        {
            name: 'handler.delete',
            method: destroy,
            options: {}
        }]);

    next();
};

exports.register.attributes = {
    name: 'handler',
    version: '1.0.0'
};

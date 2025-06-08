const Course = require('../models/Course');
const { mongooseToObject } = require('../../util/mongoose');
const { response } = require('express');

class CourseController {
    // [GET] /courses/:slug
    show(req, res, next) {
        Course.findOne({ slug: req.params.slug })
            .then((course) => {
                {
                    res.render('courses/show', {
                        course: mongooseToObject(course),
                    });
                }
            })
            .catch(next);
    }

    // [GET] /courses/create
    create(req, res, next) {
        res.render('courses/create');
    }

    // [POST] /courses/store
    store(req, res, next) {
        req.body.image = `https://img.youtube.com/vi/${req.body.videoId}/sddefault.jpg`;
        const course = new Course(req.body);
        course
            .save()
            .then(() => res.redirect('/me/stored/courses'))
            .catch(next);
    }

    // [GET] /courses/:id/edit
    edit(req, res, next) {
        console.log('Edit params:', req.params);

        Course.findById(req.params.id)
            .then((course) => {
                console.log('Found course:', course);
                res.render('courses/edit', {
                    course: mongooseToObject(course),
                });
            })
            .catch((error) => {
                console.error('Edit error:', error);
                next(error);
            });
    }

    // [PUT] /courses/:id
    update(req, res, next) {
        console.log('Update params:', req.params);
        console.log('Update body:', req.body);

        if (!req.params.id) {
            return res.status(400).json({ error: 'Course ID is required' });
        }

        Course.updateOne({ _id: req.params.id }, req.body)
            .then(() => res.redirect('/me/stored/courses'))
            .catch((error) => {
                console.error('Update error:', error);
                next(error);
            });
    }

    // [DELETE] /courses/:id
    destroy(req, res, next) {
        Course.delete({ _id: req.params.id })
            .then(() => res.redirect('/me/stored/courses')) // Không về back được
            .catch(next);
    }

    // [DELETE] /courses/:id/force
    forceDestroy(req, res, next) {
        Course.deleteOne({ _id: req.params.id })
            .then(() => res.redirect('/me/trash/courses')) // Không về back được
            .catch(next);
    }

    // [PATCH] /courses/:id/restore
    restore(req, res, next) {
        Course.restore({ _id: req.params.id })
            .then(() => res.redirect('/me/trash/courses')) // Không về back được
            .catch(next);
    }

    // [POST] /courses/handle-form-actions
    handleFormActions(req, res, next) {
        switch (req.body.action) {
            case'delete':
                Course.delete({ _id: { $in: req.body['courseIds[]'] } })
                    .then(() => res.redirect('/me/stored/courses')) // Không về back được
                    .catch(next);
                break;
            default:
                res.json({ message: 'Action is invalid!'})
        }
    }
}

module.exports = new CourseController();

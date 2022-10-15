module.exports = {
    BUILD_INIT: "build::init",
    BUILD_START: "build::start",
    BUILD_END: "build::end",
    LOG_: (type) => `log::${type}`,
};

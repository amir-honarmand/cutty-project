const yup = require("yup");

exports.schemaForUser = yup.object().shape({
  fullname: yup.string().required("نام و نام خانوادگی الزامی است")
  .min(5,"تام و نام خانوادگی نباید کمتر از 5 کاراکتر باشد").max(30,"نام و نام خانوادگی نباید بیشتر از 30 کاراکتر باشد"),
  email: yup.string().required("ایمیل الزامی است").email(),
  password: yup.string().required("رمزعبور الزامی است").min(8,"کلمه عبور نباید کمتر از 8 کاراکتر باشد")
  .max(255, "کلمه عبور نباید بیشتر از 255 کاراکتر باشد"),
  repeatPassword: yup
    .string()
    .required("تکرار رمز عبور الزامی است")
    .oneOf([yup.ref("password"), null], "کلمه های عبور یکسان نیستند"),
});

exports.schemaForEditUser = yup.object().shape({
  fullname: yup.string().required("نام و نام خانوادگی الزامی است")
  .min(5,"تام و نام خانوادگی نباید کمتر از 5 کاراکتر باشد").max(30,"نام و نام خانوادگی نباید بیشتر از 30 کاراکتر باشد"),
  // password: yup.string().required("رمز عبور الزامی است").min(8, "رمز عبور نباید کمتر از 8 کاراکتر باشد")
  // .max(60, "رمز عبور نباید بیشتر از 60 کاراکتر باشد"),
})

exports.schemaForUrl = yup.object().shape({
  url: yup.string().url("لطفا آدرس url خود را صحیح و کامل وارد کنید").required("آدرسی وارد نشده است").max(700, "آدرس وارد شده نباید بیشتر از 700 کاراکتر باشد"),

});

exports.schemaForCutUrl = yup.object().shape({
  cutUrl: yup.string().required("آدرسی وارد نشده است").max(20, "آدرس وارد شده نباید بیشتر از 20 کاراکتر باشد"),

});
import React from 'react';
import SweetAlert from 'react-bootstrap-sweetalert';
import Swal from 'sweetalert2';
import images from './Themes/images';

const Alert = (props) => {
  const { setting } = props;

  // icon = {success, error, info}
  const alertGeneral = (icon = '', show = false, title = '', content = '') => {
    {
      show &&
        Swal.fire({
          icon: icon,
          title: title,
          text: content,
          allowOutsideClick: false,
          showConfirmButton: true,
          confirmButtonColor: '#3366ff',
        });
    }
    return;
  };

  const alertConfirm = (show = false, title = '', content = '') => {
    {
      show &&
        Swal.fire({
          icon: 'question',
          title: title,
          text: content,
          allowOutsideClick: false,
          showCancelButton: true,
          showConfirmButton: true,
          confirmButtonColor: '#3366ff',
          reverseButtons: true,
        }).then((result) => {
          /* Read more about isConfirmed, isDenied below */
          console.log('result alertconfirm :> ', result);
        });
    }
    return;
  };

  // content = {loading, progressing, uploading}
  const alertLoading = (show = false, content = 'Loading') => {
    return (
      <SweetAlert
        custom
        show={show}
        style={{ width: 150, height: 150 }}
        showConfirm={false}
        customIcon={images.loading}
      >
        {content}
      </SweetAlert>
    );
  };

  return (
    <div>
      {setting.type == 'general'
        ? alertGeneral(setting.icon, setting.show, setting.title, setting.content)
        : setting.type === 'confirm'
        ? alertConfirm(setting.show, setting.title, setting.content)
        : setting.type === 'loading'
        ? alertLoading(setting.show, setting.content)
        : ''}
    </div>
  );
};

export default Alert;

// <Alert setting.type={3} show={true} onConfirm={() => ""} content="THIS CONTENT" />
//#region  this.props
// setting.type  : 1 = Success
//                 2 = Error
//                 3 = Confirm
//                 4 = Information
//                 5 = Loading
//                 6 = Processing
// show         : show alert modal
// content      : content
//#endregion

// #ALERT
// 1. Success
//          btn : OK
//          title : Success
//          content : [Add/Update/Delete] Driver Successed

// 2. Error
//          btn : OK
//          title : Error
//          content :  [Add/Update/Delete] Driver Failed
//          errorMessage : ???

// 3. Confirm
//          btn : Cancel/Yes
//          title : Confirm?
//          content : Are you sure to [Add/Update/Delete] Driver

// 4. Information
//          btn : OK
//          title : Informaion
//          content : ???

// 5. Loading
//          btn : OK
//          content : Loading

// 6. Processing
//          btn : OK
//          content : Processing

// REF : https://sweetalert2.github.io/

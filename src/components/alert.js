import React from 'react';
import SweetAlert from 'react-bootstrap-sweetalert';
import Swal from 'sweetalert2';
import images from './Themes/images';

const Alert = (props) => {
  const { setting } = props;

  // icon = {success, error, warning, info}
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

// REF : https://sweetalert2.github.io/

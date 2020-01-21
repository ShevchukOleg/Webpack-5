'use strict';

function toggleClass(clickTarget, classTarget, className){
    var clickTargetVariable = document.querySelector(clickTarget),
        classTargetVariable = document.querySelector(classTarget);

        function clickListener(){
            event.stopPropagation();
            this.classList.toggle('toggle-active');
            classTargetVariable.classList.toggle(className);
        }

        clickTargetVariable.addEventListener('click', clickListener);

        document.addEventListener('click', (e)=>{
            if (e.target.closest(classTarget)){
                return;
            }

            if (classTargetVariable.classList.contains(className)){
                classTargetVariable.classList.remove(className);
                clickTargetVariable.classList.remove('toggle-active');
            }
        });
}
toggleClass('.toggle-button','.sidebar', 'sidebar-open');
toggleClass('.acc-status', '.change-theme', 'active');
toggleClass('.toggle-box', 'body', 'night-mode' );

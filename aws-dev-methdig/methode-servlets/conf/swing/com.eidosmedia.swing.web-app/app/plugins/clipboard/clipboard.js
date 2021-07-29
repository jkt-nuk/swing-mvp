eidosmedia.webclient.commands.add({
    name: 'clipboard',
    icon: 'icon-copy',
    label: 'Clean copy to clipboard',
    isActive: function( ctx ) {
        // For some buttons ctx.activeObject is not available.
        return ctx.activeObject && ctx.activeObject.getType() === 'EOM::CompoundStory';
    },
    action: function( ctx, params, callback ) {
          
            var clean_text = '';  
           $('#newsuk_custom_id_for_copy').find("p","div").each(function() {
           if($(this).text().length > 0)
           {

            console.log($(this).text());
            clean_text = clean_text + $(this).text()+'\n';
           }
          });

const el = document.createElement('textarea');
  el.value = clean_text;
  el.setAttribute('readonly', '');
  el.style.position = 'absolute';
  el.style.left = '-9999px';
  document.body.appendChild(el);
  el.select();
  document.execCommand('copy');
  document.body.removeChild(el);

          console.log(clean_text);

    }
});

eidosmedia.webclient.extensions.objectActions.add('clipboard');

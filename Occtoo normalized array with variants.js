/**
  * @param data
  * @param {string} data.payload the payload as a string|null
  * @param {Object.<string, any>} data.variables any variables as key/value
  * @param {Object.<string, any>} data.meta any meta as key/value
  */

module.exports = async function (data) {
  let normalizedData = [];
  payload = JSON.parse(data.payload);
  payload.forEach(entity => {
    let entityId = entity.id;
    entity.variants.forEach(variant => {
      let variantId = variant.id;
      let combinedId = entityId + '_' + variantId

      let properties = [];
      // Adding properties from parent
      for(let key in entity){
        if(Object.prototype.hasOwnProperty.call(entity, key)){
          if(key != 'id' && key != 'variants' && key != 'options'){
            let value = entity[key];
            if(Array.isArray(entity[key])){
              value = value.join('|');
            }
            properties.push({
            id: key,
            value: value
            });
          }
        }
      }

      // Adding properties from variant
      for(let key in variant){
        if(Object.prototype.hasOwnProperty.call(variant, key)){
          let value = variant[key];
          if(Array.isArray(variant[key])){ 
              value = value.join('|');
            }
            properties.push({
            id: 'variant_' + key,
            value: value
          });
        }
      }

      let normalizedVariant = {
        key: combinedId,
        delete: false,
        properties: properties
      };

      normalizedData.push(normalizedVariant);
    });
  });

  return {"payload": JSON.stringify(normalizedData)};
};

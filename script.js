const inputFile = document.querySelector('.select__file')
const container = document.querySelector('.container')
const resetFile = document.querySelector('.reset__file')
let form
const modal = document.querySelector('.modal')
let arrData = []


const createElementForm = (elem, arg) => {
    const element = document.createElement(elem)
    if (elem === 'form') {
        container.append(element)
        return
	}
	if (elem === 'select') {
		const arr = []
		if (arg.technologies) arg.technologies.forEach(item => arr.push(`<option>${item}</option>`))
		if (arg.colors) {
			arg.colors.forEach(item => arr.push(`<option style="background-color:${item}">${item}</option>`))
			arr.push(`<option>Other</option>`)
		}
		element.innerHTML = arr.join(' ')
	}
    if (elem === 'input') {
        for (let key in arg) {
            if (key === 'mask') {
				element.setAttribute('placeholder', `${arg[key]}`)
				element.name = 'mask'
	     	}
            if (arg[key] === 'technology') {
				createElementForm('select', arg)
                let a = document.querySelector("select")
                a.setAttribute('multiple','')
                a.setAttribute('size','4')
                a.style.height = "75px"
                //Object.assign(a, {
                //   multiple:'multiple',
                //    size:'3'
                //  })
				return
			}
			if (arg[key] === 'color') {
				createElementForm('select', arg)
				return
            }
            element.setAttribute(`${key}`, `${arg[key]}`)
        }
    } 
    if (elem === 'label' || elem === 'p' || elem === 'h1' || elem === 'button') element.textContent = `${arg}`
    if (elem === 'a') {
        if (!arg.ref || !arg.text) return
        element.setAttribute('href', `${arg.ref}`)
        element.textContent = `${arg.text}`
    }
    form.append(element)
}

const createFields = fields => {
    fields.forEach(item => {
        const {label, input} = item
        if (label) createElementForm('label', label)       
        if (input) createElementForm('input', input)        
    })
}

const createReferences = references => {
    const obj = {}
    references.forEach(item => {
        for(let key in item) {
            if (key === 'input') createElementForm('input', item[key])
            if (key === 'text without ref') createElementForm('p', item[key])
            if (key === 'ref' ) obj.ref = item[key]
            if (key === 'text') obj.text = item[key]
        } 
        createElementForm('a', obj)
    })
    
}

const initFunction = request => {
    const data = JSON.parse(request)
    arrData = data
    createElementForm('form', arrData.name)
    const forms = document.querySelectorAll('form')
    forms.forEach(item => {
        if (item.innerHTML === '') form = item
    })
    if (arrData.name) createElementForm('h1', arrData.name)
    if (arrData.fields) createFields(arrData.fields)
    if (arrData.references) createReferences(arrData.references)
    if (arrData.buttons) arrData.buttons.forEach(item => createElementForm('button', item.text))
	const inputMask = document.querySelectorAll('input[name="mask"]')
	inputMask.forEach((item, i)  => {
		item.addEventListener('click', () => {
			item.id = `${i}`
			item.type = "text"
			$(`#${item.id}`).mask(`${item.placeholder}`)
		})
	})

	const select = document.querySelector('select')
	const label = document.querySelector('label')
	if (select.value[0] === '#' && label) {
		const input = document.createElement('input')
		input.type = 'color'
		input.value = select.value
		label.append(input)
		select.addEventListener('change', () => input.value = select.value)
	}
}

inputFile.addEventListener('change', () => {
  let file = inputFile.files[0]
  let reader = new FileReader()
  reader.readAsText(file)
  reader.addEventListener('load', () => initFunction(reader.result))
  reader.addEventListener('error', () => console.log(reader.error))
  document.querySelector('.input__file-button-text').textContent = inputFile.files[0].name
  document.getElementById("input__wrapper").style.visibility = "hidden";
})

resetFile.addEventListener('click', () => { 
	document.querySelector('.input__file-button-text').textContent = 'Select da file'
    arrData = []
    container.textContent = ''
    inputFile.value = ''
    document.getElementById("input__wrapper").style.visibility = "visible";
})

//document.getElementById("input__wrapper").style.visibility = "hidden";



    


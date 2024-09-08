import React, { useEffect, useState } from 'react'
import * as yup from 'yup'
import axios from 'axios'

// 👇 Here are the validation errors you will use with Yup.
const validationErrors = {
  fullNameTooShort: 'full name must be at least 3 characters',
  fullNameTooLong: 'full name must be at most 20 characters',
  sizeIncorrect: 'size must be S or M or L'
}

// 👇 Here you will create your schema.
const schema = yup.object().shape({
  fullName: yup.string().required().trim().min(3, validationErrors.fullNameTooShort).max(20, validationErrors.fullNameTooLong),
  size: yup.string().required(validationErrors.sizeIncorrect),
  //toppings: yup.array()
})

// 👇 This array could help you construct your checkboxes using .map in the JSX.
const toppings = [
  { topping_id: '1', text: 'Pepperoni' },
  { topping_id: '2', text: 'Green Peppers' },
  { topping_id: '3', text: 'Pineapple' },
  { topping_id: '4', text: 'Mushrooms' },
  { topping_id: '5', text: 'Ham' },
]

const sizes = [
  { id: "1", size: "S" },
  { id: "2", size: "M" },
  { id: "3", size: "L" }
]

export default function Form() {

  const [order, setOrder] = useState({
    fullName: '',
    size: '',
    toppings: []
  })
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState(false)
  const [errors, setErrors] = useState({
    fullName: '',
    size: '',
    toppings: []
  })
  const [validated, setValidated] = useState(false)
  const [successMessage, setSuccessMessage] = useState('')
  const [errorMessage, setErrorMessage] = useState('')


  useEffect(() => {
    schema.isValid(order).then(setValidated)
  }, [order])

  useEffect(() => {
    console.log("order: ", order)
  }, [order])


  const onChange = (evt) => {
    let { type, name, value, checked } = evt.target

    console.log("is it a dropdown: ", name)

    if (type !== 'checkbox') {

      setOrder({ ...order, [name]: value })
    } else {
      if (value !== checked && !order.toppings.includes(name)) {
        setOrder({ ...order, toppings: [...order.toppings, name] })
        value = checked
      } else {
        setOrder({
          ...order, toppings: order.toppings.filter(item => {
            console.log("item: ", item)
            item !== name
          })
        })
      }
    }

    yup.reach(schema, name).validate(value)
      .then(() => setErrors({ ...errors, [name]: '' }))
      .catch((err) => setErrors({ ...errors, [name]: err.errors[0] }))
  }

  const resetPage = () => {

    setOrder({
      fullName: '',
      size: '',
      toppings: []
    })

    document.querySelectorAll('input[type=checkbox]').forEach(el => el.checked = false);

  }

  const onSubmit = evt => {
    evt.preventDefault()

    axios.post('http://localhost:9009/api/order', order)
      .then((res) => {
        console.log("status: ", res.status)
        if (res.status === 201) {
          setSuccessMessage(res.data.message)
          setSuccess(true)
          resetPage()
        } else {
          setErrorMessage(res.data.message)
          setError(true)
        }

      })
      .catch((err) => {
        setErrorMessage(err.data.message)
        setError(true)
      })

    console.log("toppings array: ", order)

  }

  return (
    <form onSubmit={onSubmit} onReset={resetPage}>
      <h2>Order Your Pizza</h2>
      {success && <div className='success'>{successMessage}</div>}
      {error && <div className='failure'>{errorMessage}</div>}

      <div className="input-group">
        <div>
          <label htmlFor="fullName">Full Name</label><br />
          <input placeholder="Type full name" name="fullName" id="fullName" type="text" value={order.fullName} onChange={onChange} />
        </div>
        {errors.fullName && <div className='error'>{errors.fullName}</div>}
      </div>

      <div className="input-group">
        <div>
          <label htmlFor="size">Size</label><br />
          <select id="size" name="size" placeholder='----Choose Size----' value={order.size} onChange={onChange}>
            <option></option>
            {/* Fill out the missing options */}
            <option value="S">Small</option>
            <option value="M">Medium</option>
            <option value="L">Large</option>
          </select>
        </div>
        {errors.size && <div className='error'>{errors.size}</div>}
      </div>

      <div className="input-group">
        {/* 👇 Maybe you could generate the checkboxes dynamically */}
        {toppings.map((item) => (
          <label key={item.topping_id}>
            <input
              name={item.topping_id}
              type="checkbox"
              onChange={onChange}
            />
            {item.text}<br />
          </label>
        ))}
      </div>
      {/* 👇 Make sure the submit stays disabled until the form validates! */}
      <input disabled={!validated} type="submit" />
    </form>
  )
}

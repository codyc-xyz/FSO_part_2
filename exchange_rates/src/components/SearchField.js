const SearchField = ({value, onChange}) => {
  return (
    <div>
      find countries: <input value={value} onChange={onChange}/>
    </div>
  )
}

export default SearchField
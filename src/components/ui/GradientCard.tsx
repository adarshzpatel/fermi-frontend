const GradientCard:React.FC<{children:React.ReactNode,cls?:string}> = (props) => {
  return <div className={"bg-gradient-to-br p-[0.5px] rounded-lg from-fuchsia-500 flex overflow-hidden  via-cyan-400 to-emerald-400 " + props?.cls}>
    <div className="bg-[#111216] flex-1 rounded-lg">
    {props.children}
    </div>
  </div>  
}
export default GradientCard
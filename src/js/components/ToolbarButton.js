import React from 'react';

export default function({onMouseDown, isActive, icon}) {
	return(
		<div className="text-editor__button" onMouseDown={onMouseDown} data-active={isActive}>
			<span className="material-icons">{icon}</span>
		</div>
	);
};
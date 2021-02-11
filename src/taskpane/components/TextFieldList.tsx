import { ConstrainMode, DetailsList, DetailsListLayoutMode, IColumn, mergeStyleSets, SelectionMode, TextField } from 'office-ui-fabric-react';
import * as React from 'react';
import { FRIDA_Variable } from './interfaces';

interface TextFieldProps {
    Entities: FRIDA_Variable[];
    onChangeValue?: any;
}

const classNames = mergeStyleSets({
    names: {
        textAlign: 'center',
        margin: 'auto'
    }
});

export default class TextFieldList extends React.Component<TextFieldProps> {

    constructor(props: TextFieldProps) {
        super(props);
    }

    render() {
        const { Entities, onChangeValue } = this.props;

        const columns: IColumn[] = [
            {
                key: 'column1',
                name: 'Nombre',
                fieldName: 'name',
                className: classNames.names,
                minWidth: 50,
                maxWidth: 100,
                isResizable: true,
                onRender: (item: FRIDA_Variable) => {
                    return item.Name;
                }
            },
            {
                key: 'column2',
                name: 'Valor',
                fieldName: 'value',
                minWidth: 100,
                isResizable: true,
                onRender: (item: FRIDA_Variable, index) => {
                    return < TextField key={item.ID} name={`${index}`} value={item.Value} onChange={onChangeValue} autoComplete="off" />
                }
            }
        ];

        return (
            <DetailsList
                items={Entities}
                columns={columns}
                selectionMode={SelectionMode.none}
                compact={true}
                constrainMode={ConstrainMode.unconstrained}
                layoutMode={DetailsListLayoutMode.justified}
            />
        );
    }
}